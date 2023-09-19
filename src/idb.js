class IDB {
  /**
   * Open a cost db in the indexedDB
   * @param {string} name
   * @param {number} version
   * @returns {Promise<DB>}
   */
  openCostsDB(name, version) {
    // type checking the input
    if (typeof name !== 'string' || typeof version !== 'number') {
      return Promise.reject(new BadInputError());
    }

    // return promise to enable async/await
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

        // create a db if doesnt exist with the required fields
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
   * Add a cost object to the db
   * @param {{sum:number,category:Category,description:string,month:number,year:number}} cost
   * @returns {Promise<boolean>}
   */
  addCost(cost) {
    // Set current year & month if were not sent
    if (cost.year === undefined && cost.month === undefined) {
      const now = new Date();

      cost.year = now.getFullYear();
      cost.month = now.getMonth() + 1;
    }

    // Type check input
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

    // return promise to enable async/await
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

  /**
   * Get the costs from the db according to the given input
   * @param {number} month
   * @param {number} year
   * @returns {Promise<[{sum:number,category:Category,description:string,month:number,year:number}]>}
   */
  getDetailedReport(month, year) {
    // Type check input
    if (typeof month !== 'number' || typeof year !== 'number') {
      return Promise.reject(new BadInputError());
    }

    // return promise to enable async/await
    return new Promise((res, rej) => {
      const transaction = this.#db.transaction(DB.costsStoreName, 'readonly');
      const store = transaction.objectStore(DB.costsStoreName);
      const getRequest = store.getAll();

      getRequest.onsuccess = () => {
        // return only the rows with the matching year and month
        res(getRequest.result.filter((row) => row.year === year && row.month === month));
      };

      getRequest.onerror = () => {
        rej(null);
      };
    });
  }
}

// Custom error extending base Error for bad input
class BadInputError extends Error {
  constructor() {
    super('Bad Input');
  }
}

window.idb = new IDB();
