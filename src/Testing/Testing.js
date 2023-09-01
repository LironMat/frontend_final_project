import './Testing.css';

import { IDB } from '../idbModule';

export default function Testing() {
  async function test() {
    /**
     * @type {DB}
     */
    const db = await IDB.openCostsDB('costsdb', 1);

    const result1 = await db.addCost({ sum: 200, category: 'HOUSING', description: 'rent for 01.2023', month: 7, year: 2022 });

    const result2 = await db.addCost({ sum: 300, category: 'FOOD', description: 'food for weekend' });

    if (db) {
      console.log('creating db succeeded');
    }

    if (result1) {
      console.log('adding 1st cost succeeded');
    }

    if (result2) {
      console.log('adding 2nd cost succeeded');
    }

    const result3 = await db.getDetailedReport(7, 2022);

    if (result3) {
      console.log(result3);
    }
  }

  return <button onClick={(e) => test()} />;
}
