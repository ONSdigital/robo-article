export async function load({ parent }) {
  const { places } = await parent();

  return {places};
}