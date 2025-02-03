import { create } from "zustand";

type NotificationType = "default" | "primary" | "secondary" | "success" | "warning" | "danger";

interface INotificationStore {
  isOpen: boolean,
  title: string,
  type: NotificationType;
  openNotification: (title: string, type: NotificationType) => void;
  closeNotification: (title: string, type: NotificationType) => void;
}

const useNotification = create<INotificationStore>((set) => ({
  isOpen: false,
  title: "",
  type: "primary",
  openNotification: (title, type = "primary") => set({ isOpen: true, title: title, type: type }),
  closeNotification: (title = '', type = "primary") => set({ isOpen: false, title: title, type: type })
}));

export default useNotification;