function fomatTime(jsonTime, type) {
    //this function only work for this format '/Date(-2208938400000)/'
    var re = /-?\d+/;
    var m = re.exec(jsonTime);
    d = new Date(parseInt(m[0]));

    if (type == 'd') {

        var mm = d.getMonth() + 1;
        var dd = d.getDate();
        var yy = d.getFullYear();


        return dd + '/' + mm + '/' + yy;
    }

    else if(type== 't') {
        return d.toLocaleTimeString();
    }
    else {
        return "input is not a valied Format"
    }

}