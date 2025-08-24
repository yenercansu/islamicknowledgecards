const KEY = "icg:saved"

export function getSaved(): any[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]")
  } catch {
    return []
  }
}

export function setSaved(list: any[]) {
  localStorage.setItem(KEY, JSON.stringify(list))
  window.dispatchEvent(new Event("storage")) // let UI refresh
}

export function toggleSaved(uid: string, payload?: any) {
  const list = getSaved()
  const i = list.findIndex((x) => x.uid === uid)
  if (i >= 0) {
    list.splice(i, 1)
  } else {
    list.unshift({ uid, ...payload })
  }
  setSaved(list)
}

export function unsave(uid: string) {
  const list = getSaved().filter((x) => x.uid !== uid)
  setSaved(list)
}

export function isSaved(uid: string) {
  return getSaved().some((x: any) => x.uid === uid)
}
