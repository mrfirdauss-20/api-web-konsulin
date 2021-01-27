/*$.getJSON('http://localhost:5000/ustaz', function(data){
    console.log(data);
    let ustaz = data.NamaLengkap;
    console.log(ustaz)
})*/
/*$.getJSON("http://localhost:5000/ustaz", function (result) {
    console.log(result);
    $.each(result, function (i) {
        document.getElementById("jadi").innerHTML += "Nama :" + result[i].NamaLengkap + "<br>Nama :" + result[i].almamater + "<br>Alamat :" + result[i].photo + "<br><br>";
    });
});*/

$.getJSON("http://localhost:5000/ustaz", function (data) {
    console.log(data);
    $.each(data, function (i) {
        $('#jadi').append('<div class="col mx-3 card"><div class="card-body"><div class="foto"><img class="foto" src="' + data[i].photo + '"></div><div class="deskripsi"><h5>' + data[i].NamaLengkap + '</h5><p>' + data[i].almamater +'</p></div></div></div></div>')
    });
});