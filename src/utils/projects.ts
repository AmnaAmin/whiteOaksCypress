import {
  ProjectType,
  ProjectWorkOrderType,
  ProjectColumnType,
  ProjectAlertType,
} from "types/project.type";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { projectColumnData } from "../components/table/make-data";
import { useClient } from "utils/auth-context";
import { TableColumnSetting } from "../types/table-column.types";

const PROJECTS_QUERY_KEY = "projects";
export const useProjects = () => {
  const client = useClient();

  const { data, ...rest } = useQuery<Array<ProjectType>>(
    PROJECTS_QUERY_KEY,
    async () => {
      const response = await client(
        `projects?page=0&size=10000000&sort=id,asc`,
        {}
      );

      return response?.data;
    }
  );

  return {
    projects: data,
    ...rest,
  };
};

export const useProject = (projectId?: string) => {
  const client = useClient();

  const { data: projectData, ...rest } = useQuery<ProjectType>(
    ["project", projectId],
    async () => {
      const response = await client(`projects/${projectId}/vendor`, {});

      return response?.data;
    }
  );

  return {
    projectData,
    ...rest,
  };
};

export const useProjectWorkOrders = (projectId) => {
  const client = useClient();

  return useQuery<ProjectWorkOrderType[]>("GetProjectWorkOrders", async () => {
    const response = await client(`project/${projectId}/workorders`, {});

    return response?.data;
  });
};

export const useProjectAlerts = (projectId, login) => {
  const client = useClient("/alert/api");

  return useQuery<ProjectAlertType[]>("GetProjectAlerts", async () => {
    const response = await client(`alert-histories/project/${projectId}`, {});

    return response?.data.filter((alert) => alert.login === login);
  });
};
