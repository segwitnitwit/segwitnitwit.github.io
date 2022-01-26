class Random {
    constructor(seed) {
      this.seed = seed
    }
    random_dec() {
      /* Algorithm "xor" from p. 4 of Marsaglia, "Xorshift RNGs" */
      this.seed ^= this.seed << 13
      this.seed ^= this.seed >> 17
      this.seed ^= this.seed << 5
      return ((this.seed < 0 ? ~this.seed + 1 : this.seed) % 1000) / 1000
    }
    random_num(a, b) {
      return a+(b-a)*this.random_dec()
    }
    random_int(a, b) {
      return Math.floor(this.random_num(a, b+1))
    }
    random_bool(p) {
      return this.random_dec() < p
    }
    random_choice(list) {
      return list[Math.floor(this.random_num(0, list.length * 0.99))]
    }
  }
  
  function random_hash() {
    let x = "0123456789abcdef", hash = '0x'
    for (let i = 64; i > 0; --i) {
      hash += x[Math.floor(Math.random()*x.length)]
    }
    return hash
  }
const urlParams = new URLSearchParams(window.location.search)
const id = urlParams.get('id') !== null ? Number(urlParams.get('id')) : 3104
const spacing = urlParams.get('spc') !== null ? Number(urlParams.get('spc')) : 5
const x_dim = urlParams.get('xdim') !== null ? Number(urlParams.get('xdim')) : 100
const y_dim = urlParams.get('ydim') !== null ? Number(urlParams.get('ydim')) : 100
const seed = parseInt(random_hash().slice(0, 16), 16)
const r = new Random(seed)

let fr = urlParams.get('fr') !== null ? Number(urlParams.get('fr')) : 1
let board = []
let next = []
let canvasDim_x = x_dim * spacing
let canvasDim_y = y_dim * spacing
let time = 0
let start = false
let img;
let r_mod
let g_mod
let b_mod
let displayFr

let x_array = shuffle(Array.from(Array(x_dim-1).keys()).slice(1))
let y_array = shuffle(Array.from(Array(y_dim-1).keys()).slice(1))

function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle...
    while (currentIndex != 0) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }

function keyPressed(key) {
	console.log(key.keyCode)
    if (key.keyCode === 32) {
        start = !start
    }
    if (key.keyCode === 70) { // f key increase fr
      if (fr === 1) {
        start = true
      }
      if (fr < 60) {
        fr++
      }
      
      console.log(fr)
    }
    if (key.keyCode === 83) { // s key decrease fr
      if (fr > 1) {
        fr--
      }
      if (fr === 1) {
        console.log(start)
        start = false
      }
      
      console.log(fr)
    }
}

function preload() {
  let url ='https://api.bastardganpunks.club/'+id;
  httpGet(url, 'json', false, function(response) {
    imgUrl = response.image.replace("https://ipfs.io/ipfs/","https://segwitnitwit.mypinata.cloud/ipfs/");    
    img = loadImage(imgUrl)
  });
  console.log(img.width)
}

function setup() {
  img.resize(x_dim,y_dim)
  console.log(img.width)
    pixelDensity(1)
    // frameRate(30)
    frameRate(fr)
    let color
  createCanvas(canvasDim_x,canvasDim_y)
  for (var x = 0; x < x_dim; x++) {
    board[x]=[]
    for (var y = 0; y < y_dim; y++) {
        if(x===0 || x===(x_dim-1) || y === 0 || y ===(y_dim-1)) {
            board[x][y] = {r:0, g:0, b:0, a:0}
        } else {
            color = img.get(x,y)
            board[x][y]={r:color[0], g:color[1], b:color[2], a:color[3]}
        }
        
    }
  }

  for (var x = 0; x < x_dim; x++) {
    next[x]=[]
    for (var y = 0; y < y_dim; y++) {
        next[x][y] = {r:0,g:0,b:0, a:0}
    }
  }
  
  r_mod = r.random_int(0,255)
  g_mod = r.random_int(0,255)
  b_mod = r.random_int(0,255)


}

function draw() {
  // if (start) {
  //   if (fr <24 &&  time%3 === 0) {
  //     fr+=2
  //   }
  //   time++
    
  // }
  frameRate(fr)
    noStroke()
    for (var x = 0; x < x_dim; x++) {
      for (var y = 0; y < y_dim; y++) {
        fill(board[x][y].r,board[x][y].g,board[x][y].b,board[x][y].a)
        square(x*spacing,y*spacing,spacing)
      }
  }
  if (start) {
    generate()
  }
  displayFr = fr
  if (fr === 1) {
    displayFr = start ? 1 : 0
  }
  document.getElementById("runningStatus").innerHTML = "Status: " + (start ? "Started(press space to stop)" : "Stopped (press space to start)");
  document.getElementById("frameRate").innerHTML = "FPS: " + displayFr + "<br> f: +FPS <br> s: -FPS";
}

function generate() {
  let x
  let y
    for (let _x = 0; _x < x_array.length; _x++) {
        for (let _y = 0; _y < y_array.length; _y++) {
          x = x_array[_x]
          y = y_array[_y]
          
            let x_mod = r.random_int(-1,1)
            let y_mod = r.random_int(-1,1)
            let sym = board[x][y]
            let compSym= board[x+x_mod][y+y_mod]
            let hiSym = Math.max(sym.r,sym.g,sym.b)
            let hiSymRGB = sym.r === hiSym ? "R" : sym.g === hiSym ? "G" : "B"
            let hiCompSym = Math.max(compSym.r,compSym.g,compSym.b)
            let hiCompSymRGB = compSym.r === hiCompSym ? "R" : compSym.g === hiCompSym ? "G" : "B"

            if(x===0 || x===(x_dim-1) || y === 0 || y ===(y_dim-1)) {
             next[x][y]={r:0, g:0, b:0}
            } else if (x+x_mod===0 || x+x_mod===(x_dim-1) || y+y_mod === 0 || y+y_mod ===(y_dim-1)) {
              next[x+x_mod][y+y_mod] = {r:0, g:0, b:0,a:0}
              next[x][y] = board[x][y]
            } else {
              if (hiSymRGB === "R") {
                if (hiCompSymRGB === "G") {
                  next[x+x_mod][y+y_mod] = sym
                  next[x][y] = sym
                } else {
                  next[x][y]=compSym
                  next[x+x_mod][y+y_mod] = compSym
                }
              }
  
              if (hiSymRGB === "G") {
                if (hiCompSymRGB === "B") {
                  next[x+x_mod][y+y_mod] = sym
                  next[x][y] = sym
                } else {
                  next[x][y]=compSym
                  next[x+x_mod][y+y_mod] = compSym
                } 
              }
  
              if (hiSymRGB === "B") {
                if (hiCompSymRGB === "R") {
                  next[x+x_mod][y+y_mod] = sym
                  next[x][y] = sym
                } else {
                  next[x][y]=compSym
                  next[x+x_mod][y+y_mod] = compSym
                }
              }
              
            }
        }
    }
    // Swap!
    let temp = board;
    board = next;
    next = temp;
  }