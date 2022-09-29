const canvasSketch = require('canvas-sketch');

//load 'random' function
const random = require('canvas-sketch-util/random');


const settings = {
  dimensions: [ 1920, 1080 ]
};

let manager;

let text = 'A';
let fontSize = 600;
let fontFamily = 'serif';

const typeCanvas = document.createElement('canvas');
const typeContext = typeCanvas.getContext('2d');

const sketch = ({ context, width, height}) => {
    const cell = 20;
    const mytype = 1;
    const cols = Math.floor(width / cell);
    const rows = Math.floor(height / cell);
    const numCells = cols * rows; 

    typeCanvas.width  = cols;
    typeCanvas.height = rows;

    return({ context, width, height }) => {
    typeContext.fillStyle = 'black';
    typeContext.fillRect(0, 0, cols, rows);

    //fontsize of the large letter
    fontSize = cols * 0.5;
    
    typeContext.fillStyle = 'white';
    typeContext.font = `${fontSize}px ${fontFamily}`;
    typeContext.textBaseline = 'top';
    //typeCtextAlign = 'center';

    const metrics = typeContext.measureText(text);
    const mx = metrics.actualBoundingBoxLeft * -1;
    const my = metrics.actualBoundingBoxAscent * -1;
    const mw = metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight;
    const mh = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

    const tx = (cols - mw) * 0.5 -mx;
    const ty = (rows - mh) * 0.5 - my;
    
    typeContext.save();
    typeContext.translate(tx, ty);

    //draws a line around the actual type shape
    typeContext.beginPath();
    typeContext.rect(mx, my, mw, mh);
    typeContext.stroke();

    // typeContext.fillText(text, 0 , 0);
    typeContext.fillText(text, 0 , 0);
    typeContext.restore();

    const typeData = typeContext.getImageData(0, 0, cols, rows).data;
    
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    //align glyph characters to middle
    context.textBaseline = 'middle';
    context.textAlign    = 'center';

    //this draws the small character in the upper roght hand corner
    //context.drawImage(typeCanvas, 0, 0);
    
    for (let i = 0; i < numCells; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);

      const x = col * cell;
      const y = row * cell;

      //declare pixel values rgba
      const r = typeData[i * 4 + 0];
      const g = typeData[i * 4 + 1];
      const b = typeData[i * 4 + 2];
      const a = typeData[i * 4 + 3];

      //use different chars based on brightness
      const glyph = getGlyph(r);

      //enlarge the glyph cell size and determine fill font size
      context.font =`${cell * 2}px ${fontFamily}`;
      if (Math.random() < 0.1) context.font =`${cell * 6}px ${fontFamily}`;

      //then use the declared values to draw the picture
      context.fillStyle = 'white';

      context.save();
      context.translate(x, y);

      //this aligns the circles below correctly
      context.translate(cell * 0.5, cell + 0.5);

      //this is rectangles
      //context.fillRect(0, 0, cell, cell);

      //this uses  circles
      //context.beginPath();
      //context.arc(0, 0, cell * 0.5, 0, Math.PI * 2);
      //context.fill();

      //this uses glyphs

      context.fillText(glyph, 0, 0);
      
      context.restore();
      }   
  };
};

const getGlyph = (v) => {
    if (v < 50) return '';
    if (v < 100) return '.';
    if (v < 150) return '/';
    if (v < 200) return 'Bad';   

    const glyphs = '_=/'.split('');

    //pick a random chracter from 'glyphs'
    return random.pick(glyphs);
}

const onKeyUp = (e) => {
    text = e.key.toUpperCase();
    manager.render(); 
};

document.addEventListener('keyup', onKeyUp);

const start = async () => {
    manager = await canvasSketch(sketch, settings); 
};

start();