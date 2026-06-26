import { describe, it, expect } from 'vitest'
import { NAV_SECTIONS, BOTTOM_NAV, APP_SCREENS, LABEL_MAP } from './navConfig'

describe('navConfig', () => {
  it('all sidebar nav items have corresponding APP_SCREENS entries', () => {
    const navIds = new Set<string>()
    NAV_SECTIONS.forEach(s => s.items.forEach(i => navIds.add(i.id)))
    BOTTOM_NAV.forEach(i => navIds.add(i.id))
    for (const id of navIds) {
      expect(APP_SCREENS).toContain(id)
    }
  })

  it('all sidebar nav items have labels in LABEL_MAP', () => {
    const navIds = new Set<string>()
    NAV_SECTIONS.forEach(s => s.items.forEach(i => navIds.add(i.id)))
    BOTTOM_NAV.forEach(i => navIds.add(i.id))
    for (const id of navIds) {
      expect(LABEL_MAP).toHaveProperty(id)
    }
  })

  it('all APP_SCREENS have labels in LABEL_MAP', () => {
    for (const s of APP_SCREENS) {
      expect(LABEL_MAP).toHaveProperty(s)
    }
  })

  it('every nav section has at least one item', () => {
    for (const s of NAV_SECTIONS) {
      expect(s.items.length).toBeGreaterThan(0)
    }
  })

  it('every nav item has required fields', () => {
    const allItems = [
      ...NAV_SECTIONS.flatMap(s => s.items),
      ...BOTTOM_NAV,
    ]
    for (const item of allItems) {
      expect(item.id).toBeTruthy()
      expect(item.label).toBeTruthy()
      expect(item.icon).toBeTruthy()
    }
  })

  it('no duplicate nav IDs', () => {
    const allIds = [
      ...NAV_SECTIONS.flatMap(s => s.items),
      ...BOTTOM_NAV,
    ].map(i => i.id)
    expect(new Set(allIds).size).toBe(allIds.length)
  })
})
