  const keyword = ["and","array","asm","begin","case","const","constructor","div","do","export","nil","not","object","of","or","packed","procedure","program","record","shl","shr","file","for","function","goto","if","implementation","in","inherited","label","library","mod","string","then","to","type","write","writeln","read","wincrt","crt","readln","unit","until","uses","wih","xor","else","set","interface","while","begin","end","downto","repeat","inline","var","integer","byte","longint"];
  const opr = ["+", "-", "*", "/", ":=", "mod", "div"]
  const log = ["<",">","=","<=",">=","!="]
  const del = [".",",",":",";","(",")","[","]"]
  var t_identifier = [],
  t_keyword = [],
  t_operator = [],
  t_konstanta = 
    {
      int : [

      ],
      riil : [

      ],
      chr : [

      ],
      bool : [

      ],
      str : [

      ]
    },
  t_logic = [],
  t_delimiter = [],
  t_id = [],
  kode = [],
  srcCode

  $("#convert").click(function(){     
    // clear()          
    getAnalisis = $("#hasilanalisis").val();
    if (getAnalisis == "") {
      Swal.fire(
      'Ooops!',
      'Source code tidak boleh kosong!',
      'error'
    )
  }          
    getAnalisis = getAnalisis.trim()          
    getAnalisis = getAnalisis.replace(/@"\{(.*)\}",/gi, "")
    var getString = getAnalisis.split(/(')/)          
    var getNumber = getAnalisis.split(/(\s|;)/)
    kode = getAnalisis.split(/(\s|;|\/\/|\(\*|\*\)|{|}|'|\(|\)|\[|\]|\,|\.)/)          
    kode = kode.filter(item => {
      return item !== '' && item !== ' '
    })                    
    
    var komentar = false          
    var isString = false          
    var lineString = []
    var lineOpr = []
    var oprTemp = []
    var logTemp = []
    var delTemp = []
    var keywordTemp          

    getNumber.forEach(item => {            
      if(/^[+-]?\d+\.\d+?$/.test(item)){
        t_konstanta.riil.push(item)
      }

      if(/^(-[0-9]|[0-9])/.test(item) && !/^[+-]?\d+\.\d+?$/.test(item)){                                      
        t_konstanta.int.push(item)            
      }
    })

    getString.forEach(item => {
      if(isString){                          
        if(/'/g.test(item)){                
          isString = false                
          return
        }
        if(item.length == 1) 
          t_konstanta.chr.push(item)
        else
          t_konstanta.str.push(item)
        return
      }

      if(/'/g.test(item)){
        isString = true
        return
      }            
    });                            

    kode.forEach((item, key) => {            
      if(komentar){                      
        if(komentar == '//' && item == '\n') komentar = false
        if(komentar == '{' && /}/g.test(item)) komentar = false
        if(komentar == '(*' && /\*\)/g.test(item)) komentar = false              
        return
      }
      if(isString){
        if(/'/g.test(item)){
          isString = false
          lineString.push(key)
        }              
        return
      }

      if(/\/\//g.test(item)){
        komentar = '//'
        return
      }
      if(/{/g.test(item)){
        komentar = '{'
        return
      }
      if(/\(\*/g.test(item)){
        komentar = '(*'
        return
      }

      if(/'/g.test(item)){
        isString = true
        lineString.push(key)
        return
      }            
      keywordTemp = keyword.filter(value => {
        return value === item
      }).filter(onlyUnique)

      if(keywordTemp.length > 0){
        t_keyword.push(keywordTemp[0])
        return
      }          

      oprTemp = opr.filter(value => {
        return new RegExp('\\'+value, 'g').test(item)
      }).filter(onlyUnique)            

      if(oprTemp.length > 0){
        t_operator.push(oprTemp[0])
        lineOpr.push(key)
        return
      }

      logTemp = log.filter(value => {
        return new RegExp('\\'+value, 'g').test(item)
      }).filter(onlyUnique)

      if(logTemp.length > 0){
        t_logic.push(logTemp[0])
        return
      }            

      delTemp = del.filter(value => {
        return new RegExp('\\'+value, 'g').test(item)
      }).filter(onlyUnique)
      
      if(delTemp.length > 0){
        t_delimiter.push(delTemp[0])
        return
      }

      if(item == 'false' || item == 'true'){
        t_konstanta.bool.push(item)
        return
      }   
      
      if(/^[+-]?\d+(\.\d+)?$/.test(item)){                
          return
      }

      if(/([A-Za-z0-9]+)/g.test(item)){
        t_id.push(item)
        return
      }            
    })  
    //memasukan ke dalam textfield                             
    console.log(t_keyword)
    $("#keywordout").val(t_keyword)
    console.log(t_operator)
    console.log(t_logic)
    $("#operator").val(t_operator, t_logic)   
    console.log(t_delimiter)
    $("#delimiter").val(t_delimiter)

    var strBuilder = [];
    for(key in t_konstanta) {
      if (t_konstanta.hasOwnProperty(key)) {
        strBuilder.push(t_konstanta[key]);
      }
    }
    console.log(t_konstanta)
    $("#integer").val(strBuilder[0])
    $("#char").val(strBuilder[1])
    $("#boolean").val(strBuilder[2])
    $("#riil").val(strBuilder[3])
    $("#string").val(strBuilder[4])
    


    console.log(t_id)
    $("#identifier").val(t_id)
    console.log(getAnalisis)
  })                

  function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }

  function clear(){
    t_identifier = []
    t_keyword = []
    t_operator = []
    t_konstanta = 
      {
        int : [

        ],
        riil : [

        ],
        chr : [

        ],
        bool : [

        ],
        str : [

        ]
      };
    t_logic = []
    t_delimiter = []
    t_id = []
    kode = []   
  }


  $(".sample").click(() => {
      var sample_code = "program bil_genap;\nuses crt;\nvar bil1,bil2:integer;\nbegin clrscr;\nwriteln('=================');\nwriteln('Tutorial Koding');\nwriteln('=================');\nwriteln('');\nwrite('Masukan Bilangan Pertama : ');\nreadln(bil1);\nwrite('Masukan Bilangan Kedua : ');\nreadln(bil2);\nwrite('Bilangan Genap Yang Ditemukan : ');\nfor bil1:=bil1 to bil2 do\nbegin\nif (bil1 mod 2 = 0) then\nbegin\n write(bil1,' ');\n end;\nend;\nreadln;\nend.";
      $("#hasilanalisis").text(sample_code)
  })