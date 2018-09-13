const a = 5;

const fn = function fn() {
  console.log(this.a);
};

fn().bind(this);
