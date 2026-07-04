/**
 * Registers all built-in icons in the icon registry.
 *
 * Called by registerDefaults(). Merges icons from the former static maps
 * in icons.ts (block/page icons) and SidebarNav.tsx (navigation icons).
 *
 * Consumers can register additional icons via registerIcon() / registerEntityIcon()
 * without modifying this file.
 */

import {
  Activity01Icon,
  AlertCircleIcon,
  ArrowDown01Icon,
  ArrowRight01Icon,
  ArrowUp01Icon,
  Calendar03Icon,
  Cancel01Icon,
  ChartLineData01Icon,
  CheckmarkCircle01Icon,
  CheckmarkSquare01Icon,
  Clock01Icon,
  CloudIcon,
  CodeIcon,
  Copy01Icon,
  DashboardBrowsingIcon,
  Database01Icon,
  Delete02Icon,
  Download01Icon,
  Edit02Icon,
  File01Icon,
  FileExportIcon,
  FilterIcon,
  FolderOpenIcon,
  GitBranchIcon,
  Globe02Icon,
  GraduationScrollIcon,
  HelpCircleIcon,
  Home01Icon,
  InboxIcon,
  LayersLogoIcon,
  Link01Icon,
  LockIcon,
  MailAtSign01Icon,
  Menu01Icon,
  MonitorDotIcon,
  MoreHorizontalIcon,
  Notification03Icon,
  PieChart01Icon,
  Plug01Icon,
  PuzzleIcon,
  RefreshIcon,
  RssIcon,
  Search01Icon,
  Settings01Icon,
  Settings02Icon,
  ShieldKeyIcon,
  ShoppingCart01Icon,
  SquareIcon,
  StarIcon,
  Tag01Icon,
  Target01Icon,
  TerminalIcon,
  Upload01Icon,
  UserGroupIcon,
  UserIcon,
  ViewIcon,
  WorkflowSquare06Icon,
  Wrench01Icon,
  ZapIcon,
} from "@hugeicons/core-free-icons";

import { registerEntityIcon, registerIcon } from "./icon-registry";

let registered = false;

export function registerDefaultIcons(): void {
  if (registered) return;
  registered = true;

  // ── General icons (blocks, page header, actions) ──────────────────────────
  registerIcon("inbox", InboxIcon);
  registerIcon("square", SquareIcon);
  registerIcon("arrow-up", ArrowUp01Icon);
  registerIcon("arrow-down", ArrowDown01Icon);
  registerIcon("arrow-right", ArrowRight01Icon);
  registerIcon("check-circle", CheckmarkCircle01Icon);
  registerIcon("check", CheckmarkSquare01Icon);
  registerIcon("circle-x", Cancel01Icon);
  registerIcon("alert-circle", AlertCircleIcon);
  registerIcon("search", Search01Icon);
  registerIcon("menu", Menu01Icon);
  registerIcon("settings", Settings01Icon);
  registerIcon("settings-2", Settings02Icon);
  registerIcon("plug", Plug01Icon);
  registerIcon("filter", FilterIcon);
  registerIcon("layout-dashboard", DashboardBrowsingIcon);
  registerIcon("dashboard", DashboardBrowsingIcon);
  registerIcon("puzzle", PuzzleIcon);
  registerIcon("git-branch", GitBranchIcon);
  registerIcon("shield", ShieldKeyIcon);
  registerIcon("lock", LockIcon);
  registerIcon("users", UserGroupIcon);
  registerIcon("user", UserIcon);
  registerIcon("chart", ChartLineData01Icon);
  registerIcon("calendar", Calendar03Icon);
  registerIcon("mail", MailAtSign01Icon);
  registerIcon("bell", Notification03Icon);
  registerIcon("cloud", CloudIcon);
  registerIcon("link", Link01Icon);
  registerIcon("workflow", WorkflowSquare06Icon);
  registerIcon("database", Database01Icon);
  registerIcon("code", CodeIcon);
  registerIcon("file-export", FileExportIcon);
  registerIcon("tag", Tag01Icon);
  registerIcon("layers", LayersLogoIcon);
  registerIcon("segment", FilterIcon);
  registerIcon("edit", Edit02Icon);
  registerIcon("delete", Delete02Icon);
  registerIcon("trash", Delete02Icon);
  registerIcon("copy", Copy01Icon);
  registerIcon("view", ViewIcon);
  registerIcon("eye", ViewIcon);
  registerIcon("download", Download01Icon);
  registerIcon("upload", Upload01Icon);
  registerIcon("refresh", RefreshIcon);
  registerIcon("clock", Clock01Icon);
  registerIcon("star", StarIcon);
  registerIcon("folder", FolderOpenIcon);
  registerIcon("file", File01Icon);
  registerIcon("globe", Globe02Icon);
  registerIcon("more-horizontal", MoreHorizontalIcon);
  registerIcon("external-link", Globe02Icon);
  registerIcon("sliders-horizontal", FilterIcon);

  // ── Navigation-specific icons (from SidebarNav) ───────────────────────────
  registerIcon("home", Home01Icon);
  registerIcon("shopping-cart", ShoppingCart01Icon);
  registerIcon("zap", ZapIcon);
  registerIcon("graduation-cap", GraduationScrollIcon);
  registerIcon("wrench", Wrench01Icon);
  registerIcon("terminal", TerminalIcon);
  registerIcon("target", Target01Icon);
  registerIcon("pie-chart", PieChart01Icon);
  registerIcon("activity", Activity01Icon);
  registerIcon("monitor", MonitorDotIcon);
  registerIcon("file-text", File01Icon);
  registerIcon("rss", RssIcon);
  registerIcon("help-circle", HelpCircleIcon);

  // ── Entity type icons (navigation entity resolution) ──────────────────────
  registerEntityIcon("connector", Plug01Icon);
  registerEntityIcon("workflow", WorkflowSquare06Icon);
  registerEntityIcon("segment", FilterIcon);
  registerEntityIcon("instancegroup", LayersLogoIcon);
  registerEntityIcon("condition", GitBranchIcon);
  registerEntityIcon("compliance", ShieldKeyIcon);
  registerEntityIcon("offering", Tag01Icon);
  registerEntityIcon("order", ShoppingCart01Icon);
  registerEntityIcon("course", GraduationScrollIcon);
  registerEntityIcon("form", File01Icon);
  registerEntityIcon("certificate", FileExportIcon);
}
