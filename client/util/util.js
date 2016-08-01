//import s2 from 's2geometry-node';
util = {
  getNeighbors: function getNeighbors(lat, lng){
    let origin = new s2.S2CellId(new s2.S2LatLng(lat, lng)).parent(15);
    let walk = [origin.id()];
    // 10 before and 10 after
    let next = origin.next();
    let prev = origin.prev();
    for (let i = 0; i < 10; i++) {
      // in range(10):
      walk.push(prev.id());
      walk.push(next.id());
      next = next.next();
      prev = prev.prev();
    }
    return walk;
  }
}