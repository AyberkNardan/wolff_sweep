

let lat0;
let up_color;
let down_color;
let cluster_color;
function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(5);
  up_color = color(44,70,146);
  down_color = color(117,20,40);
  cluster_color = color(0,255,0);
  lat0 = new square_lattice(30,30,up_color,down_color,cluster_color);
  lat0.build_lattice();

}

function draw() {
  //background(220);
  lat0.wolff_sweep(1.8,1.0);
}

function keyPressed() {
  if (key === 's') {
    // 5 saniyelik GIF kaydeder, kayda 1 saniye sonra başlar
    saveGif('wolff_sweep_animation', 25, { delay: 1 });
  }
}

class square_lattice{
  constructor(nr,nc,u_color,d_color,cluster_color){
    this.nr = nr;
    this.nc = nc;
    this.dx = width/nc;
    this.dy = height/nr;
    this.N = nr*nc;
    this.u_color = u_color;
    this.d_color = d_color;
    this.cluster_color = cluster_color;
    this.lattice = new Array(this.N)
  }

  find_neighs(i,j){
    let rght = [(i+1)%this.nc,j];
    let lft = [(i-1+this.nc)%this.nc,j];
    let up = [i,(j-1+this.nr)%this.nr];
    let down = [i,(j+1)%this.nr];
    return [up[0] + up[1]*this.nc,down[0] + down[1]*this.nc,rght[0]+rght[1]*this.nc,lft[0]+lft[1]*this.nc];
  }

  build_lattice(){
    for(let i=0;i<this.nc;i++){
      for(let j=0;j<this.nr;j++){
        let k = i + j*this.nc
        let sz = floor(random(2));
        let s_color = sz === 1 ? this.u_color : this.d_color;
        let site = {spin:[0,0,sz],
        
        pos:createVector(i*this.dx,j*this.dy,0),
        indx:k,
        neighs:this.find_neighs(i,j),
        clr:s_color,
      };
        this.lattice[k] = site;
      }
    }
  }


  wolff_sweep(T,J){
    let site = floor(random(this.N));
    this.lattice[site].clr = this.cluster_color;
    let cnt = true;
    let dL = 0;
    let cluster = [site];
    while(cnt){
      let l_current = cluster.length;
      for(let k of cluster.slice(-dL)){
        for(let kn of this.lattice[k].neighs){
          let s_spin = this.lattice[k].spin[2];
          let n_spin = this.lattice[kn].spin[2];
          if(s_spin==n_spin){
            if(random()<1-exp(-2*J/T) && !cluster.includes(kn)){
              cluster.push(kn);
              this.lattice[kn].clr = this.cluster_color;
              this.display_lattice();
            }
          }
        }
      let l_new = cluster.length;
      dL = l_new-l_current;
      if(dL==0){
        cnt = false;
      }
    }

  }
  //flip the cluster
  for(let k of [...new Set(cluster)]){
    let s = this.lattice[k].spin[2];
    this.lattice[k].spin[2] = abs(s-1);
    this.lattice[k].clr = abs(s-1) === 1 ? this.u_color : this.d_color;
  }
  //this.display_lattice();

  }


  display_lattice(){
    for(let k=0;k<this.N;k++){
      let site = this.lattice[k];
      let pos = site.pos;
      let c = site.clr;
      noStroke();
      //strokeWeight(4);
      fill(c);
      rect(pos.x,pos.y,this.dx,this.dy);

    }

  }
}