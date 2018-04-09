% rebase('base.tpl')

<div class="content">
    <div class="row">
        <div class="col s3">
            <img class="avatar" src="https://avatars2.githubusercontent.com/u/8425057?s=460&v=4">
        </div>
        <div class="col s9">
            <div>
                Name: WWW
            </div>
            <hr>
            <div>
                Birth: AIUSHD
            </div>
            <hr>
            <div>
                Birth date: Aug, 14, 112
            </div>
            <hr>
            <div>
                Home: 1236, 12 Cell, 51 Region, Moon
            </div>
            <hr>
            <div>
                Contact: 12726138126783
            </div>
        </div>
        
        <div class="col s12">
            <div class="courses">
                % for item in courseList:
                <li class="course">
                    <div class="elem number">{{item.number}}</div>
                    <div class="elem">{{item.year}}</div>
                    <div class="elem">{{item.quater}}</div>
                    <div class="right elem">{{item.title}}</div>
                    <div class="elem">{{item.department}}</div>
                </li>
                % end
            </div>
        </div>
    </div>

</div>