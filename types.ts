
export interface Task {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
}

export interface Project {
  id: string;
  name: string;
  progress: number;
  date: string;
  team: string[];
}

export interface NavItem {
  id: string;
  label: string;
  icon: string;
}

export enum AppTab {
  DASHBOARD = 'dashboard',
  TASKS = 'tasks',
  CALENDAR = 'calendar',
  BRAIN = 'brain'
}
