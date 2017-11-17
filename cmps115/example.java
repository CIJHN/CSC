class SuperStats implements Stats {
    int getSuperData() {
        // do sth
    }
    int getData() { 
        return this.getSuperData();
    }
}

class UberStatsAdaptor implements Stats {
    private UberStats stat;

    UberStatsAdaptor(UberStats stat) {
        this.stat  = stat;
    }

    int getData() { 
        return stat.getUberData();
    }
}

class UberStats  {
    int getUberData();
}

interface Stats {
    int getData();
    void setData(int value);
}

class DataVis {
    private Stats stat;

    DataVis(Stats stat) {
        this.stat = stat;
    }

    int func() {
        stat.getData();
        //somehow change the state
        stat.setData(any);
        return int;
    }

    public static void main () { 
        // SuperStats s = new SuperStats();
        UberStatsAdaptor u = new UberStatsAdaptor(new UberStats());
        int directOut = new DataVis(u).func();
        int indirectOut = u.getData();
    }
}