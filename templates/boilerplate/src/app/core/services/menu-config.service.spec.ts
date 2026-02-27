import { TestBed } from "@angular/core/testing";
import { MenuConfigService } from "./menu-config.service";

describe("MenuConfigService", () => {
  let service: MenuConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MenuConfigService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("menuItems() should return a non-empty array", () => {
    expect(service.menuItems().length).toBeGreaterThan(0);
  });

  it("menuItems() should include the home item with routerLink '/'", () => {
    const home = service.menuItems().find((m) => m.routerLink === "/");
    expect(home).toBeTruthy();
    expect(home?.label).toBe("Inicio");
  });

  it("menuItems() should include the settings item with routerLink '/settings'", () => {
    const settings = service
      .menuItems()
      .find((m) => m.routerLink === "/settings");
    expect(settings).toBeTruthy();
    expect(settings?.label).toBe("Configuración");
  });

  it("every item should have a label and an icon", () => {
    service.menuItems().forEach((item) => {
      expect(item.label).toBeTruthy();
      expect(item.icon).toBeTruthy();
    });
  });
});
