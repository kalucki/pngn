export const nextSelectedLayerIds = (
  currentIds: string[],
  clickedId: string | null,
  additive: boolean,
): string[] => {
  if (!clickedId) {
    return additive ? currentIds : []
  }
  if (!additive || currentIds.length === 0) {
    return [clickedId]
  }
  if (currentIds.includes(clickedId)) {
    if (currentIds.length === 1) return currentIds
    return currentIds.filter((id) => id !== clickedId)
  }
  return [...currentIds, clickedId]
}
