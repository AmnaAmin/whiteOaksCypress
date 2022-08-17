import React from "react";
import { Flex, Box, Text } from "@chakra-ui/react";
import { Task } from "./task-types.ds";
import { dateFormat } from "utils/date-time-utils";
import { theme } from 'theme/theme'

const styles = {"taskListWrapper":"_3ZbQT","taskListTableRow":"_34SS0","taskListCell":"_3lLk3","taskListNameWrapper":"_nI1Xw","taskListExpander":"_2QjE6","taskListEmptyExpander":"_2TfEi"};

const titleCss = {
  color: "gray.600",
  fontSize: 14,
  fontWeight: 500,
}

const valueCss = {
  color: "gray.500",
  fontSize: 14,
  fontWeight: 400,
}

export const ProjectTaskListTable:React.FC<{
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
    <Box
      className={styles.taskListWrapper}
    >
      {tasks.length > 0 ? (
        <>
          {tasks.map((task,index) => (
            <Box
              key={task.id+"-"+index}
              className={styles.taskListTableRow}
              height={rowHeight}
            >
              <Box
                className={styles.taskListCell}
                minW={rowWidth}
                maxW={rowWidth}
              >
                <Flex
                  justifyContent="space-between"
                  padding="5px 15px"
                >
                  <Flex
                    direction="column"
                    gap={4}
                  >
                    <Text
                    >
                      {index === 0 ? 'Project' : 'White Oaks Aligned'}
                    </Text>
                    <Text>
                      {task.name}
                    </Text>
                    <Text style={titleCss}></Text>
                    <Text style={valueCss}>{task.name}</Text>
                  </Flex>
                  <Flex
                    direction={"column"}
                    gap={4}
                  >
                    <Text>Start ***************** End</Text>
                    <Flex
                      justifyContent="space-between"
                    >
                      <Text style={valueCss}>{dateFormat(task?.start as Date)}</Text>
                      <Text style={valueCss}>{dateFormat(task?.end as Date)}</Text>
                    </Flex>
                  </Flex>

                </Flex>
              </Box>
            </Box>
          ))}
        </>
      ): null}
    </Box>
  )
};
  