interface param {
   name: string;
   value: string | number;
   isQuery?: boolean;
   valueIsPath?: boolean;
}

export const fetchAsJson = (domain: string, params: Array<param>) => {
   const headers = {
      method: "GET",
      headers: {
         "Access-Control-Allow-Origin": "*",
         "Cache-Control": "no-cache",
         "Content-Type": "application/json",
      },
   };

   const hasNoQueries = params
      .map(({ isQuery }) => isQuery)
      .every((value) => value === undefined);

   // search URL builder.
   let urlParams = "";
   let urlQueries = hasNoQueries ? "" : "?";

   params.forEach(({ isQuery, valueIsPath }, index) => {
      let { value, name } = params[index];

      if (valueIsPath && typeof value !== "number") {
         value = new URLSearchParams(value).toString().replace("=", "");
      }

      if (isQuery) {
         urlQueries +=
            urlQueries.length > 2 ? `&${name}=${value}` : `${name}=${value}`;
      } else {
         urlParams += `/${value}`;
      }
   });

   return fetch(
      `http://localhost:3010/${domain}${urlParams}${urlQueries}`,
      headers
   ).then((res) => res.json());
};
