export type Socks = { style: string, color: string }
export type Shirt = { style: string; size: string }
export type Pants = { waist: number; length: number }

export class Drawer<T> {
    private items: T[] = []

    public isEmpty() {
        return this.items.length == 0
    }

    public addItem(item: T): void {
        this.items.push(item)
    }

    public removeItem() {
        if(!this.isEmpty()) {
            return this.items.pop()
        } else {
            return undefined
        }
    }

    public removeAll() {
        let itemsArray: T[] = [...this.items]
        this.items = []
        return itemsArray
    }

}

export class Dresser<TopType, MiddleType, BottomType> {
    public top: Drawer<TopType>;
    public middle: Drawer<MiddleType>;
    public bottom: Drawer<BottomType>;

    constructor(
        top: Drawer<TopType>, 
        middle: Drawer<MiddleType>, 
        bottom: Drawer<BottomType>
    ) {
        this.top = top;
        this.middle = middle;
        this.bottom = bottom;
    }
}

export function demonstrator(): void {
    const topDrawer = new Drawer<Shirt>()
    const middleDrawer = new Drawer<Pants>()
    const bottomDrawer = new Drawer<Socks>()

    const dresser = new Dresser(topDrawer, middleDrawer, bottomDrawer)

    console.log('Call to isEmpty to see if top drawer initializes to empty: ', dresser.top.isEmpty())

    console.log('Add two items to top drawer, one to middle, and one to bottom')

    dresser.top.addItem({style: 'polo', size: 'medium'})
    dresser.top.addItem({style: 'dress shirt', size: 'medium'})

    dresser.middle.addItem({waist: 32, length: 34})

    dresser.bottom.addItem({style: 'ankle', color: 'white'})

    console.log('Checking each drawer now that items are added: ')
    console.log('isEmpty top drawer: ', dresser.top.isEmpty())
    console.log('isEmpty middle drawer: ', dresser.middle.isEmpty())
    console.log('isEmpty bottom drawer: ', dresser.bottom.isEmpty())

    console.log('Remove only item in bottom drawer: ', dresser.bottom.removeItem())
    console.log('isEmpty bottom drawer: ', dresser.bottom.isEmpty())

    console.log('Remove both items in top drawer with removeAll: ', dresser.top.removeAll())
    console.log('isEmpty top drawer: ', dresser.top.isEmpty())
}

demonstrator()