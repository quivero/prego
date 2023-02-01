import _ from "lodash";

import { batchAssert } from "./assertions";
import { buildScene } from "./build";

const check = (scenes) => batchAssert(scenes);

export const atest = (fixtures, act) => {
    act.setup();

    const setFixtures = act.prepare(fixtures);
    let performanceItems = act.perform(setFixtures);

    performanceItems = performanceItems.map(
        (performanceItem) => buildScene(performanceItem)
    );

    check(performanceItems);

    act.teardown();

    return setFixtures;
};

export const batchAtest = (fixtures, acts) => {
  _.zip(fixtures, acts).forEach((fixture_act) =>
    atest(fixture_act[0], fixture_act[1])
  );
};


export const rehearse = (acts) => acts.forEach((act) => it(act.description, act.callback));

export const practice = (rehearsals) => {
    rehearsals.forEach((rehearsal) => it(rehearsal.description, rehearsal.callback));
};

export const cast = (plays) => plays.forEach((play) => describe(play.name, play.callback));
