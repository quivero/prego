import _ from "lodash";

import { batchAssert } from "./assertions";
import { buildScene } from "./build";

const check = (scenes) => batchAssert(scenes);

export const atest = (fixtures, act) => {
  act.setup();

  const setFixtures = act.prepare(fixtures);
  const performanceItems = act.perform(setFixtures);
  const scenes = performanceItems.map(buildScene);

  check(scenes);

  act.teardown();

  return setFixtures;
};

export const practice = (fixtures, acts) => {
  let thisFixtures = { ...fixtures };

  const actCallnack = (act) => {
    const preparedFixtures = atest(thisFixtures, act);
    thisFixtures = { ...preparedFixtures, thisFixtures };
  };

  acts.forEach(actCallnack);
};

export const rehearse = (rehearsals) => {
  const rehearseCallnack = (rehearsal) =>
    it(rehearsal.description, rehearsal.callback);

  rehearsals.forEach(rehearseCallnack);
};

export const cast = (plays) => {
  const playCallback = (play) => describe(play.name, play.callback);

  plays.forEach(playCallback);
};
