


export const artifactErrorMessage = (ItemCriteria = "") => {
  const artifactCriterium = "either an item or array of items with true-return callback";
  const artifactDescription = `An artifact is ${artifactCriterium}. \n`;

  return artifactDescription + ItemCriteria;
}
