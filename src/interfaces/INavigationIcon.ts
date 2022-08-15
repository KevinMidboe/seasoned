export default interface INavigationIcon {
  title: string;
  route: string;
  icon: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  requiresAuth?: boolean;
  useStroke?: boolean;
}
