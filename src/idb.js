class IDB {
  /**
   *
   * @param {string} name
   * @param {number} version
   * @returns {Promise<DB|DOMException>}
   */
  openDB(name, version) {
    if (typeof name !== 'string' || typeof version !== 'number') {
      return Promise.reject(new BadInputError());
    }

    return new Promise((res, rej) => {
      const dbRequest = indexedDB.open(name, version);

      dbRequest.onsuccess = () => {
        res(new DB(dbRequest.result));
      };

      dbRequest.onerror = () => {
        rej(dbRequest.error);
      };

      dbRequest.onupgradeneeded = (event) => {
        /** @type {IDBDatabase} */
        const db = event.target.result;

        const costsStore = db.createObjectStore(DB.costsStoreName, {
          keyPath: 'id',
          autoIncrement: true,
        });

        costsStore.createIndex('sum', 'sum', { unique: false });
        costsStore.createIndex('category', 'category', { unique: false });
        costsStore.createIndex('description', 'description', { unique: false });
        costsStore.createIndex('year', 'year', { unique: false });
        costsStore.createIndex('month', 'month', { unique: false });
      };
    });
  }
}

class DB {
  static costCategories = ['FOOD', 'HEALTH', 'EDUCATION', 'TRAVEL', 'HOUSING', 'OTHER'];
  static costsStoreName = 'costs';

  #db;

  /**
   *
   * @param {IDBDatabase} dbResult
   */
  constructor(dbResult) {
    this.#db = dbResult;
  }

  /**
   *
   * @param {{sum:number,category:Category,description:string,month:number,year:number}} cost
   * @returns {Promise<boolean>}
   */
  addCost(cost) {
    if (cost.year === undefined && cost.month === undefined) {
      const now = new Date();

      cost.year = now.getFullYear();
      cost.month = now.getMonth();
    }

    if (
      !cost ||
      typeof cost.sum !== 'number' ||
      typeof cost.category !== 'string' ||
      typeof cost.description !== 'string' ||
      typeof cost.year !== 'number' ||
      typeof cost.month !== 'number' ||
      !DB.costCategories.includes(cost.category)
    ) {
      return Promise.reject(new BadInputError());
    }

    return new Promise((res, rej) => {
      const transaction = this.#db.transaction(DB.costsStoreName, 'readwrite');
      const store = transaction.objectStore(DB.costsStoreName);
      const addRequest = store.add({
        sum: cost.sum,
        category: cost.category,
        description: cost.description,
        year: cost.year,
        month: cost.month,
      });

      addRequest.onsuccess = () => {
        res(true);
      };

      addRequest.onerror = () => {
        rej(false);
      };
    });
  }
}

class BadInputError extends Error {
  constructor() {
    super('Bad Input');
  }
}

window.idb = new IDB();
