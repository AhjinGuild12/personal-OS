export type ThemeId = 'neo' | 'xp' | 'aqua';

export interface DesktopTheme {
  backgroundColor: string;
  backgroundImage: string;
  showGrid: boolean;
}

export interface StartButtonTheme {
  bg: string;
  bgHover: string;
  text: string;
  borderRadius: string;
  iconType: 'grid' | 'flag' | 'apple';
}

export interface WindowTabTheme {
  border: string;
  borderRadius: string;
  activeBg: string;
  activeText: string;
  inactiveBg: string;
  inactiveText: string;
  activeShadow: string;
  inactiveShadow: string;
}

export interface SystemTrayTheme {
  bg: string;
  borderColor: string;
  textColor: string;
  subTextColor: string;
}

export interface TaskbarTheme {
  bg: string;
  borderTop: string;
  startButton: StartButtonTheme;
  windowTab: WindowTabTheme;
  systemTray: SystemTrayTheme;
}

export interface ControlButtonsTheme {
  style: 'neo-squares' | 'xp-icons' | 'traffic-lights';
  position: 'right' | 'left';
}

export interface WindowTheme {
  borderWidth: string;
  borderColor: string;
  borderRadius: string;
  shadow: string;
  /** 'per-app' uses APP_CONFIGS titleBarColor; 'uniform' uses a single color; 'gradient' uses a CSS gradient */
  titleBarMode: 'per-app' | 'uniform' | 'gradient';
  titleBarBg: string;
  titleBarTextColor: string;
  titleBarBorderBottom: string;
  titleBarPadding: string;
  titleCentered: boolean;
  contentBg: string;
  controlButtons: ControlButtonsTheme;
}

export interface StartMenuTheme {
  bg: string;
  border: string;
  shadow: string;
  borderRadius: string;
  headerBg: string;
  headerTextColor: string;
  programsBg: string;
  programsHover: string;
  placesBg: string;
  placesHover: string;
  footerBg: string;
  footerBorder: string;
  sectionLabelColor: string;
  dividerColor: string;
  iconBorder: string;
  iconShadow: string;
  iconRadius: string;
}

export interface ThemeDefinition {
  id: ThemeId;
  name: string;
  desktop: DesktopTheme;
  taskbar: TaskbarTheme;
  window: WindowTheme;
  startMenu: StartMenuTheme;
}
