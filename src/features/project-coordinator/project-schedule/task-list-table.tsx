import React from "react";
import { Flex } from "@chakra-ui/react";
import { Task } from "./task-types.ds";
import { dateFormat } from "utils/date-time-utils";

const styles = {"taskListWrapper":"_3ZbQT","taskListTableRow":"_34SS0","taskListCell":"_3lLk3","taskListNameWrapper":"_nI1Xw","taskListExpander":"_2QjE6","taskListEmptyExpander":"_2TfEi"};

const titleCss = {
  color: "#4A5568",
  fontSize: 14,
  fontWeight: 500,
}

const valueCss = {
  color: "#718096",
  fontSize: 14,
  fontWeight: 400,
}

export const Project_TaskListTable:React.FC<{
  rowHeight: number;
  rowWidth: string;
  fontFamily: string;
  fontSize: string;
  locale: string;
  tasks: Task[];
  selectedTaskId: string;
  /**
   * Sets selected task by id
   */
  setSelectedTask: (taskId: string) => void;
  onExpanderClick: (task: Task) => void;
}> = (props) => {

  const rowHeight = "80px",
  rowWidth = "450px",
  tasks = props.tasks;
  
  return (
    <div
      className={styles.taskListWrapper}
    >
      {tasks.length > 0 ? (
        <>
          {tasks.map((task,index) => (
            <div
              key={task.id+"-"+index}
              className={styles.taskListTableRow}
              style={{
                height: rowHeight
              }}
            >
              <div
                className={styles.taskListCell}
                style= {{
                  minWidth: rowWidth,
                  maxWidth: rowWidth
                }}
              >
                <Flex
                  justifyContent={"space-between"}
                  padding={"5px 15px"}
                >
                  <Flex
                    direction={"column"}
                    gap={4}
                  >
                    <span style={titleCss}>{index === 0 ? 'Project' : 'White Oaks Aligned'}</span>
                    <span style={valueCss}>{task.name}</span>
                  </Flex>
                  <Flex
                    direction={"column"}
                    gap={4}
                  >
                    <span>Start ***************** End</span>
                    <Flex
                      justifyContent={"space-between"}
                    >
                      <span style={valueCss}>{dateFormat(task?.start as Date)}</span>
                      <span style={valueCss}>{dateFormat(task?.end as Date)}</span>
                    </Flex>
                  </Flex>

                </Flex>
              </div>
            </div>
          ))}
        </>
      ): null}
    </div>
  )
};
  