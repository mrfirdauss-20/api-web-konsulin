$.getJSON('https://powerful-peak-20198.herokuapp.com/ustaz', function (data) {
    let ustaz = data.ustaz;
    console.log(ustaz)
    console.log(data);
    $.each(data, function (i) {
        $('#ustaad').append('<div class="col-md-3 mx-3 card card-profil"><div class="card-body card-body-profil"><div class="foto" ><img src="' + data[i].photo + '"></div><div class="deskripsi"><h5>' + data[i].NamaLengkap + '</h5><p>' + data[i].kategori + '</p><p>' + data[i].almamater + '</p></div></div></div >')
    });
});



