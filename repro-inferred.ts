new class {
  private map: Record<string, TypeName[]> = { x: ['f_0|i_0'] }

  constructor() {
    let item
    if (this.map.x) {
      const [entry] = this.map.x
      item = entry
    }
    console.log('item:', item)
  }
}()
