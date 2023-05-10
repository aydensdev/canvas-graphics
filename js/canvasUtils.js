class canvasUtils { constructor(bufferData) {
    this.setBuffer = (bufferData) => {
        this.buffer = bufferData;
    };
    this.fillPixel = (r, g, b, a, i) => {
        this.buffer.data[i + 0] = r;
        this.buffer.data[i + 1] = g;
        this.buffer.data[i + 2] = b;
        this.buffer.data[i + 3] = a;
    };
    this.fillLine = (a, b) => {
        //calulates all line vertices
        let x0 = a.x, x1 = b.x;
        let y0 = a.y, y1 = b.y;
        let dx =  Math.abs(b.x - a.x), dy = -Math.abs(b.y - a.y);
        let sx = (a.x < b.x) ? 1 : -1, sy = (a.y < b.y) ? 1 : -1;
        let error = dx + dy;
        var line = [];

        while (true){
            line.push({x:x0, y:y0});
            if (x0 == x1 && y0 == y1){ break };
            let e2 = 2 * error;
            if (e2 >= dy){
                if (x0 == x1){ break };
                error += dy;
                x0 += sx;
            };
            if (e2 <= dx){
                if (y0 == y1){ break };
                error += dx;
                y0 += sy;
            };
        };

        //interpolates, fills, and returns verticies in line
        let data = [];
        line.forEach((value, i, arr) => {
            let c0 = a.c.map(x => x*((line.length-i) / line.length));
            let c1 = b.c.map(x => x*(i / line.length));
            let c2 = [c0[0]+c1[0], c0[1]+c1[1], c0[2]+c1[2]];

            this.fillPixel(c2[0], c2[1], c2[2], 255, index(value.x, value.y, canvas.width, canvas.height));
            data.push({x: value.x, y: value.y, c:c2});
        });
        return data;
    };

    this.fillTriangle = (a, b, c) => {
        var unsorted = [], scanline = [];

        //saves data to unsorted list
        function saveToUnsorted(data){
            data.forEach((vert, i) => {
                unsorted.forEach((val, i) => {
                    if(vert.x == val.x && vert.y == val.y){ unsorted.splice(i, 1) };
                });
                unsorted.push(vert);
            });
        };

        //starts with outline
        saveToUnsorted(this.fillLine(a, b));
        saveToUnsorted(this.fillLine(b, c));
        saveToUnsorted(this.fillLine(c, a));
        let rangeY = this.sortNum([a.y, b.y, c.y]);
        let length = Math.abs(rangeY[0])+Math.abs(rangeY[1]);

        //fills in space between outline, line by line
        for(let i = 0; i < length+1; i++){
            scanline.push([]);
        };
        unsorted.forEach((val) => {
            let heightIndex = length-(val.y+Math.abs(rangeY[1]));
            scanline[heightIndex].push({x: val.x, y: val.y, c: val.c});
        });
        scanline.forEach((val) => {
            if(val.length == 1){
                val.push({x:val[0].x, y:val[0].y, c:val[0].c});
            }
            this.fillLine(val[1], val[0]);
        })
    };

    this.sortNum = (array) => {
        var min = Infinity, max = 0;
        array.forEach(value => {
            if(value > max){ max = value };
            if(value < min){ min = value };
        });
        return [max, min];
    };
}};
