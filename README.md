# facto

Tile API:

  cueInputItem (item, dir)

    sets inputItem = {item: item, dir: dir};

  canAcceptInputItem (item)

    return true if can take more items
    (defaults to "return !this.inputItem")
