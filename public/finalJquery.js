$.getJSON('https://powerful-peak-20198.herokuapp.com/ustaz', function (data) {
    //let ustaz = data.ustaz;
    //console.log(ustaz)
    console.log(data);
    $.each(data, function (i) {
        $('#ustaad').append('<div class="col-md-3 mx-3 card card-profil"><div class="card-body card-body-profil"><div class="foto" ><img src="' + data[i].photo + '"></div><div class="deskripsi"><h5>' + data[i].NamaLengkap + '</h5><p>' + data[i].kategori + '</p><p>' + data[i].almamater + '</p></div></div></div >')
    });
});


$.getJSON('https://powerful-peak-20198.herokuapp.com/artikel', function (data) {
    //let ustaz = data.ustaz;
    //console.log(ustaz)
    //console.log(data);
    $.each(data, function (i) {
        $('#aartikel').append('<div class="col"><div class="card card-artikel mb-4"><div class="card-body card-body-artikel mx-2"><div class="box-gambar my-2"><img src="' + data[i].gambar + '"></div><div class="kategori text-center my-3">' + data[i].kategori + '</div><h3>' + data[i].judulArtikel + '</h3><a href="https://powerful-peak-20198.herokuapp.com/artikel/isi/'+(i+1)+'">Baca selengkapnya...</a></div></div></div>')
    });
});

$.getJSON('https://powerful-peak-20198.herokuapp.com/event', function (data) {
    /*let ustaz = data.ustaz;
    console.log(ustaz)*/
    console.log(data);
    $.each(data, function (i) {
        console.log(i)
        if(i==0){
            $('#eevent').append('<div class="carousel-item active"><div class="gambar"><img src="' + data[i].photo + '" class="d-block w-100" alt="..."></div><div class="carousel-caption d-none d-md-block"><h5>' + data[i].namaEvent + '</h5><p>' + data[i].keterangan + '</p></div></div>')
        }else{
            $('#eevent').append('<div class="carousel-item"><div class="gambar"><img src="' + data[i].photo+'" class="d-block w-100" alt="..."></div><div class="carousel-caption d-none d-md-block"><h5>' + data[i].namaEvent + '</h5><p>' + data[i].keterangan + '</p></div></div>')
        }
    });
});
//'<div class="col"><div class="card card-artikel mb-4"><div class="card-body card-body-artikel mx-2"><div class="box-gambar my-2"><img src="' + data[i].gambar + '"></div><div class="kategori text-center my-3">' + data[i].kategori + '</div><h3>' + data[i].judulArtikel + '</h3><a href="#">Baca selengkapnya...</a></div></div></div>'


