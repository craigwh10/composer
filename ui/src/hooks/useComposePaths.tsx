import { useQuery, useMutation, useQueryClient } from "react-query";

export const useComposePaths = (chosenSearchPath: string | null) => {
  let error = null;

  const queryClient = useQueryClient();
  const HOOK_KEY = `useComposePaths-${chosenSearchPath}`;

  const { isLoading, data } = useQuery(HOOK_KEY, () => {
    chosenSearchPath &&
      fetch(`http://localhost:3002/compose-paths/${chosenSearchPath}`).then(
        (res) => res.json()
      );
  });

  if (!chosenSearchPath) {
    return {
      isLoading: false,
      data: null,
      error: "No path provided",
    };
  }

  return {
    isLoading,
    data,
    error,
  };
};
