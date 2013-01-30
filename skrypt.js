/*jshint node: true, browser: true, jquery: true */
/*global io: false */
$(document).ready(function () {
    'use strict';
    var socket = io.connect(),
        myName = '';

    $('#addTask').hide();
    $('#taska').hide();
	$('#zegar').show();
    console.log('connecting…');

    socket.on('connect', function () {
        console.log('connected!');
    });


    socket.on('zlyLogin', function(msg){
        $('#login').append('<br><font size="2">'+msg+'</font>');
    });
	
	socket.on('newTime', function(time){
        $('#zegar').html('<br><font size="2">'+time+'</font>');
    });
	

	//---------------------------------------------------------------------------
    socket.on('newTask', function(data){
        console.log("new task");
        $('#active').html('');
        $('#history').html('');
        var dzisiaj = new Date();
        var dzisiajStr = dzisiaj.getFullYear() + '-' + dzisiaj.getMonth() + '-' + dzisiaj.getDate();
		//var teraz = new Date();
		//var terazStr = teraz.getHours()+':'+teraz.getMinutes()+':'+teraz.getSeconds();
		
		for(var i=0; i<data.length; i++){
            if(data[i].status===0){
                var dataZadania = new Date(data[i].data);   
                var dataZadaniaStr = dataZadania.getFullYear() + '-' + dataZadania.getMonth() + '-' + dataZadania.getDate();
                
				//var czasZadania = new Date();
				//czasZadania.setHours(data[i].time);		
				//var czasZadaniaStr = czasZadania.getHours()+':'+czasZadania.getMinutes()+':'+czasZadania.getSeconds();
				
				if(dzisiajStr>dataZadaniaStr){
                    if(data[i].user===myName){
                        $('#active').append('<li id="'+i+'" class="arv"><div id="pole" class="'+i+'"<p><center>'+data[i].nazwa+'</center><br><b>'+ data[i].data+'&nbsp; '+data[i].time+'</b><span class="user">'+data[i].user+'</span></p></div></li>');
                    }else{
                        $('#active').append('<li id="'+i+'" class="arv"><div id="pole" class="'+i+'"<p><center>'+data[i].nazwa+'</center><br><b>'+ data[i].data+'&nbsp; '+data[i].time+'</b><span class="user2">'+data[i].user+'</span></p></div></li>');
                    }
                }else{
                    if(data[i].user===myName){
                        $('#active').append('<li id="'+i+'"><div id="pole" class="'+i+'"<p><center>'+data[i].nazwa+'</center><br><b>'+ data[i].data+'&nbsp; '+data[i].time+'</b><span class="user">'+data[i].user+'</span></p></div></li>');
                    }else{
                        $('#active').append('<li id="'+i+'"><div id="pole" class="'+i+'"<p><center>'+data[i].nazwa+'</center><br><b>'+ data[i].data+'&nbsp; '+data[i].time+'</b><span class="user2">'+data[i].user+'</span></p></div></li>');
                    }
                }
            }else{
                $('#history').append('<li id="'+i+'"><div id="pole" class="'+i+'"><p><center>'+data[i].nazwa+'</center><br><b>'+ data[i].data+'</b><span class="user2">'+data[i].user+'</span></p></div>&nbsp;<button id="del" class="'+i+'">-</button></li>');
            }   
        }
		
		
		
		
		$('#black').hide();
        $('#addTask').show();
        $('#taska').show();
		
        $("li #pole").click(function (){
            socket.emit('change', $(this).attr('class'));
        });

        $('li #del').click(function (){
            socket.emit('delete', $(this).attr('class'));
        });

    });
	//---------------------------------------------------------------------------
	
	
	$('#userLogin').keypress(function(event){
		if(event.keyCode===13){
			socket.emit('setUser', $('#userLogin').val());//po nacisnieciu enter emituje do serwera
			myName = $('#userLogin').val();
		}
	});


  

    $('#add').click(function (){ //dodawanie zadania
		var nazwa = $('#nazwa').val();  //przypisywanie wartosci
        var adresat = $('#user').val();
        var termin= $('#termin').val();
		var godzina= $('#godzina').val();
        var status = 0;
        socket.emit('addTask', {nazwa: nazwa, data: termin, time: godzina, user: adresat, status: status});
		
    });

   
});
