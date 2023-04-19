import { PAGINATION_QUERY } from '../components/Pagination';

export default function paginationField() {
  return {
    keyArgs: false, // tells apollo we will take care of everything
    read(existing = [], { args, cache }) {
      console.log('existing:', existing, 'args:', args, 'cache:', cache);
      const { skip, first } = args;
      // read no of items on the page from the cache
      const data = cache.readQuery({ query: PAGINATION_QUERY });

      const count = data?._allProductsMeta?.count;
      const page = skip / first + 1;
      const pages = Math.ceil(count / first);

      const items = existing.slice(skip, skip + first).filter((x) => x);

      // if there are items and aren't enough items to satisfy how many we requested and we're on the last page, then just send it (ie only 1 item on last page but viewing 4 per page)
      if (items.length && items.length !== first && page === pages) {
        return items;
      }

      if (items.length !== first) {
        // no items, go to network to fetch them
        return false;
      }

      // if there are items, just return them from the cache, and don't need to go to network
      if (items.length) {
        console.log(
          `there are ${items} in the cache. gonna send them to apollo`
        );
        return items;
      }

      return false; // fallback to network

      // first thing it does is ask the read function for those items
    },
    merge(existing, incoming, { args }) {
      const { skip, first } = args;
      // this runs when the apollo client comes back from the network with our product
      console.log(`incoming from network ${incoming.length}`);
      console.log('incoming', incoming);

      const merged = existing ? existing.slice(0) : [];
      merged.push(incoming);

      for(let i = skip; i < skip + incoming.length; i++) {
        merged[i] = incoming[i - skip];
      }

      console.log('merged', merged);

      return merged;
    },
  };
}
