import { AuctionItem, get_all_items, ItemState, list_item } from '../index'
import { storage, Context, u128 } from 'near-sdk-as'

describe('Auction ', () => {
  it('should create an item', () => {
    const item_id = list_item("test", "test", u128.Zero, "");
    expect(item_id).toBeGreaterThan(0, "should return an id > 0")
  });
  it("should return all items", () => {
        list_item("test", "test", u128.Zero, "");
        const items: Array<AuctionItem> = get_all_items(ItemState.All);
        expect(items.length).toBe(1, "should contain only 1 message");
  });

})
