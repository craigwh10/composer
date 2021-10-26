const variables: { app: any } = {
   app: {},
};

function setWorld(varValue: any): void {
   variables["app"] = varValue;
}

function getWorld(): any {
   return variables["app"];
}

export { setWorld, getWorld };
