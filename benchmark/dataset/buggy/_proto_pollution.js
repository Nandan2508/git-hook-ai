const merge = (target, source) => {
  for (const key in source) {
    target[key] = source[key]
  }
  return target
}

const userPrefs = merge({}, JSON.parse(req.body.prefs))