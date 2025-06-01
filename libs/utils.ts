export const sha1 = async (str: string) => {
  const buff = new Uint8Array(Array.from(str).map((c) => c.charCodeAt(0)))
  const digest = await crypto.subtle.digest("SHA-1", buff)
  return Array.from(new Uint8Array(digest))
    .map((x) => ("00" + x.toString(16)).slice(-2))
    .join("")
}

export const getNameAndTeamtag = (str?: string | null) => {
  if (!str) return { team: "", name: "" }
  const [team, name] = str.split(" | ")
  return {
    team: name ? team : "",
    name: name ? name : team,
  }
}

export const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export const getTournarySlug = (url: string): string => {
  if (!url.startsWith("https://www.start.gg/tournament/")) {
    return ""
  }
  const urlParts = url.split("/")
  if (urlParts.length < 5) {
    return ""
  }
  return `${urlParts[3]}/${urlParts[4]}`
}

export const getEventSlug = (url: string): string => {
  if (!url.startsWith("https://www.start.gg/tournament/")) {
    return ""
  }
  const urlParts = url.split("/")
  if (urlParts.length < 7) {
    return ""
  }
  return `${urlParts[3]}/${urlParts[4]}/${urlParts[5]}/${urlParts[6]}`
}

export const getPhaseId = (url: string): string => {
  if (!url.startsWith("https://www.start.gg/tournament/")) {
    return ""
  }
  const urlParts = url.split("/")
  if (urlParts.length < 9) {
    return ""
  }
  return urlParts[8]
}

export const getPhaseGroupId = (url: string): string => {
  if (!url.startsWith("https://www.start.gg/tournament/")) {
    return ""
  }
  const urlParts = url.split("/")
  if (urlParts.length < 10) {
    return ""
  }
  return urlParts[9]
}

// In-Source Tests
if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest

  describe("sha1", () => {
    it("should generate correct SHA-1 hash for simple string", async () => {
      const result = await sha1("hello")
      expect(result).toBe("aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d")
    })

    it("should generate correct SHA-1 hash for empty string", async () => {
      const result = await sha1("")
      expect(result).toBe("da39a3ee5e6b4b0d3255bfef95601890afd80709")
    })

    it("should generate different hashes for different strings", async () => {
      const result1 = await sha1("hello")
      const result2 = await sha1("world")
      expect(result1).not.toBe(result2)
    })
  })

  describe("getNameAndTeamtag", () => {
    it("should parse team and name correctly", () => {
      const result = getNameAndTeamtag("TeamName | PlayerName")
      expect(result).toEqual({ team: "TeamName", name: "PlayerName" })
    })

    it("should handle name only (no team)", () => {
      const result = getNameAndTeamtag("PlayerName")
      expect(result).toEqual({ team: "", name: "PlayerName" })
    })

    it("should handle null input", () => {
      const result = getNameAndTeamtag(null)
      expect(result).toEqual({ team: "", name: "" })
    })

    it("should handle undefined input", () => {
      const result = getNameAndTeamtag(undefined)
      expect(result).toEqual({ team: "", name: "" })
    })

    it("should handle empty string", () => {
      const result = getNameAndTeamtag("")
      expect(result).toEqual({ team: "", name: "" })
    })

    it("should handle multiple pipe separators", () => {
      const result = getNameAndTeamtag("Team | Player | Extra")
      expect(result).toEqual({ team: "Team", name: "Player" })
    })
  })

  describe("capitalize", () => {
    it("should capitalize first letter and keep rest as is", () => {
      expect(capitalize("hello")).toBe("Hello")
      expect(capitalize("WORLD")).toBe("WORLD")
      expect(capitalize("tEST")).toBe("TEST")
    })

    it("should handle empty string", () => {
      expect(capitalize("")).toBe("")
    })

    it("should handle single character", () => {
      expect(capitalize("a")).toBe("A")
      expect(capitalize("Z")).toBe("Z")
    })

    it("should handle strings with spaces", () => {
      expect(capitalize("hello world")).toBe("Hello world")
    })
  })

  describe("getTournarySlug", () => {
    it("should extract tournament slug from valid URL", () => {
      const url = "https://www.start.gg/tournament/test-tournament/events"
      const result = getTournarySlug(url)
      expect(result).toBe("tournament/test-tournament")
    })

    it("should return empty string for invalid URL format", () => {
      const url = "https://example.com/something"
      const result = getTournarySlug(url)
      expect(result).toBe("")
    })

    it("should return 'tournament/' for short URL", () => {
      const url = "https://www.start.gg/tournament/"
      const result = getTournarySlug(url)
      expect(result).toBe("tournament/")
    })

    it("should return empty string for non-start.gg URL", () => {
      const url = "https://www.example.com/tournament/test/events"
      const result = getTournarySlug(url)
      expect(result).toBe("")
    })
  })

  describe("getEventSlug", () => {
    it("should extract event slug from valid URL", () => {
      const url =
        "https://www.start.gg/tournament/test-tournament/event/test-event/brackets"
      const result = getEventSlug(url)
      expect(result).toBe("tournament/test-tournament/event/test-event")
    })

    it("should return empty string for invalid URL format", () => {
      const url = "https://example.com/something"
      const result = getEventSlug(url)
      expect(result).toBe("")
    })

    it("should return empty string for short URL", () => {
      const url = "https://www.start.gg/tournament/test-tournament/event"
      const result = getEventSlug(url)
      expect(result).toBe("")
    })

    it("should return empty string for non-start.gg URL", () => {
      const url = "https://www.example.com/tournament/test/event/test"
      const result = getEventSlug(url)
      expect(result).toBe("")
    })
  })

  describe("getPhaseId", () => {
    it("should extract phase ID from valid URL", () => {
      const url =
        "https://www.start.gg/tournament/test-tournament/event/test-event/brackets/12345/pools"
      const result = getPhaseId(url)
      expect(result).toBe("12345")
    })

    it("should return empty string for invalid URL format", () => {
      const url = "https://example.com/something"
      const result = getPhaseId(url)
      expect(result).toBe("")
    })

    it("should return empty string for short URL", () => {
      const url =
        "https://www.start.gg/tournament/test-tournament/event/test-event/brackets"
      const result = getPhaseId(url)
      expect(result).toBe("")
    })

    it("should return empty string for non-start.gg URL", () => {
      const url =
        "https://www.example.com/tournament/test/event/test/brackets/12345"
      const result = getPhaseId(url)
      expect(result).toBe("")
    })
  })

  describe("getPhaseGroupId", () => {
    it("should extract phase group ID from valid URL", () => {
      const url =
        "https://www.start.gg/tournament/test-tournament/event/test-event/brackets/12345/67890"
      const result = getPhaseGroupId(url)
      expect(result).toBe("67890")
    })

    it("should return empty string for invalid URL format", () => {
      const url = "https://example.com/something"
      const result = getPhaseGroupId(url)
      expect(result).toBe("")
    })

    it("should return empty string for short URL", () => {
      const url =
        "https://www.start.gg/tournament/test-tournament/event/test-event/brackets/12345"
      const result = getPhaseGroupId(url)
      expect(result).toBe("")
    })

    it("should return empty string for non-start.gg URL", () => {
      const url =
        "https://www.example.com/tournament/test/event/test/brackets/12345/67890"
      const result = getPhaseGroupId(url)
      expect(result).toBe("")
    })
  })
}
