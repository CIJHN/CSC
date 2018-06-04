interface ObjModel {
    [objectName: string]: {
        [groupName: string]: {
            vertices: Float32Array;
            textures: Float32Array;
            normals: Float32Array;
            indexes: Uint16Array;
        }
    }
}
namespace ObjModel {
    type ParserFunc = (tokens: string[], builder: Builder) => void;
    type BuilderObject = {
        [groups: string]: BuilderGroup,
    }
    type BuilderGroup = {
        vertices: number[];
        textures: number[];
        normals: number[];
        indexes: number[];

        rawVertices: number[],
        rawTextures: number[],
        rawNormals: number[],
    }
    export class Builder {
        private objects: {
            [name: string]: BuilderObject
        } = {};
        private current: BuilderObject | undefined;
        private currentGroup: BuilderGroup | undefined;

        constructor() { }

        private prepareObject() {
            if (!this.current)
                this.current = this.objects['default'] = {};
            return this.current;
        }
        
        private static newGroup() {
            return {
                vertices: [],
                textures: [],
                normals: [],

                indexes: [],

                rawVertices: [],
                rawTextures: [],
                rawNormals: [],
            };
        }

        private prepareGroup() {
            if (!this.currentGroup)
                this.currentGroup = this.prepareObject()['default'] = Builder.newGroup();
            return this.currentGroup;
        }
        object(name: string) {
            this.objects[name] = {};
            return this;
        }
        group(name: string) {
            this.prepareObject()[name] = Builder.newGroup();
            return this;
        }
        vertex(x: number, y: number, z: number, w: number = 1) {
            this.prepareGroup().vertices.push(x, y, z, w);
            return this;
        }

        texture(u: number, v: number, w: number = 0) {
            this.prepareGroup().textures.push(u, v, w);
            return this;
        }

        normal(x: number, y: number, z: number) {
            this.prepareGroup().normals.push(x, y, z);
            return this;
        }

        index() {
            return this;
        }

        build() {
            return {
                vertices: new Float32Array(this.vertices),
                textures: new Float32Array(this.textures),
                normals: new Float32Array(this.normals),
                indexes: new Uint16Array(this.indexes),
            }
        }
    }

    function getParsers(): { [type: string]: ParserFunc } {
        const pf = (n: string) => {
            const f = Number.parseFloat(n);
            if (Number.isNaN(f)) throw 'IllegalNumber';
            return f;
        };
        return {
            '#': (tokens, builder) => {

            },
            o: (tokens, builder) => {
                if (tokens.length !== 1) throw 'IllegalFormat';
                builder.object(tokens[0]);
            },
            g: (tokens, builder) => {
                if (tokens.length !== 1) throw 'IllegalFormat';
                builder.group(tokens[0]);
            },
            v: (tokens, builder) => {
                if (tokens.length !== 4 && tokens.length !== 3) throw 'IllegalLength';
                const x = pf(tokens[0]),
                    y = pf(tokens[1]),
                    z = pf(tokens[2]),
                    w = tokens[3] !== undefined ? pf(tokens[3]) : undefined;
                builder.vertex(x, y, z, w);
            },
            vn: (tokens, builder) => {
                if (tokens.length !== 3) throw 'IllegalLength';
                const x = pf(tokens[0]),
                    y = pf(tokens[1]),
                    z = pf(tokens[2]);
                builder.normal(x, y, z);
            },
            vt: (tokens, builder) => {
                if (tokens.length !== 2 && tokens.length !== 3) throw 'IllegalLength';
                const u = pf(tokens[0]),
                    v = pf(tokens[1]),
                    w = tokens[2] !== undefined ? pf(tokens[2]) : undefined;
                builder.texture(u, v, w);
            },
        };
    }

    export function load(text: string) {
        const lines = text.split('\n');
        const parsers: { [type: string]: ParserFunc } = getParsers();
        const builder = new Builder();
        for (let i = 0; i < lines.length; ++i) {
            const line = lines[i];
            const tokens = line.split(' ');
            const parser = parsers[tokens[0]];
            if (!parser) throw {
                type: 'IllegalObjFormat',
                message: `Illegal Obj file format at line ${i}`,
            }
            parser(tokens.slice(1, tokens.length), builder);
        }
        return builder.build();
    }
    export function save() {

    }
}