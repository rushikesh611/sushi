/* eslint-disable @next/next/no-img-element */
import { v4 as uuidv4 } from "uuid";
import { Box, Button, Typography, TextareaAutosize } from "@mui/material";
import { useState, useContext, useEffect } from "react";
import useAxiosGet from "../../hooks/useAxiosGet";
import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";
import globalContext from "../../context/globalContext";
import { useRouter } from "next/router";
import styled from "@emotion/styled";
import Header from "../../components/headers/Header";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import { authAxios } from "../../utils/authAxios";
import { backendUrl } from "../../utils/const";
import CloseIcon from "@mui/icons-material/Close";
import MemberListItem from "../../components/boards/MemberListItem";
import { SubmitHandler, useForm } from "react-hook-form";
import InviteMembersModal from "../../components/modals/InviteMembersModal";
import ChangePermissionsModal from "../../components/modals/ChangePermissionsModal";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

type FormData = {
  title: string;
  description: string;
};

interface EditFormProps {
  project: any;
  setProject: any;
  setIsEditing: any;
}

interface MemberProps {
  user: any;
  authUser: any;
  setProject: any;
}

const HeaderContainer = styled.div`
  padding: 100px 50px 0;
  background-color: #f4f5f7;
  width: 93.5%;
  border-bottom: 1px solid lightgray;
`;

const HeaderContent = styled.div`
  width: fit-content;
  margin: 0 auto;
`;

const HeaderTop = styled.div`
  display: flex;
  margin-bottom: 2em;
`;

const MembersHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2.5em;
`;

const MemberButtonsContainer = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;
  position: relative;
`;

const defaultImageUrl =
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2250&q=80";

const Project = (props) => {
  // const { id } = props.match.params;
  const { id } = props;
  const { authUser } = useContext(globalContext);

  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const { data: project, setData: setProject } = useAxiosGet(
    `/projects/${id}/`
  );

  // const project = {
  //   id: "1",
  //   title: "Project 1",
  //   description: "This is a project",
  //   image: "",
  //   members: [
  //     {
  //       id: "1",
  //       username: "rushi611",
  //       first_name: "Rushi",
  //       email: "",
  //       access_level: "2",
  //     },
  //     {
  //       id: "2",
  //       username: "testuser1",
  //       first_name: "Sanshriti",
  //       email: "",
  //       access_level: "1",
  //     },
  //   ],
  // };

  const authUserAccessLevel = project
    ? project.members.find((member) => member.username === authUser.username)
        .access_level
    : 1;

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  // if (!project) return null;

  return (
    <div>
      <Header />
      <HeaderContainer>
        <HeaderContent>
          <HeaderTop>
            <img
              style={{
                borderRadius: "5px",
                objectFit: "cover",
                width: "80px",
                height: "80px",
              }}
              // src={project.image || defaultImageUrl}
              src={defaultImageUrl}
              alt="Team Profile Picture"
            />

            {!isEditing ? (
              <div
                style={{
                  display: "flex",
                  marginLeft: "1.5em",
                  flexDirection: "column",
                }}
              >
                <Typography variant="h6" fontWeight={400}>
                  {project?.title}
                </Typography>
                {authUserAccessLevel === 2 && (
                  <Button
                    variant="outlined"
                    startIcon={<CreateOutlinedIcon />}
                    onClick={() => setIsEditing(true)}
                    sx={{
                      marginTop: "auto",
                      color: "black",
                      borderColor: "black",
                    }}
                  >
                    Edit Team Profile
                  </Button>
                )}
              </div>
            ) : (
              <EditForm
                project={project}
                setProject={setProject}
                setIsEditing={setIsEditing}
              />
            )}
          </HeaderTop>
          <Tabs value={value} onChange={handleChange} centered>
            <Tab label="Boards" />
            <Tab label="Members" />
            <Tab label="Settings" />
          </Tabs>
        </HeaderContent>
      </HeaderContainer>
      <TabPanel value={value} index={0}>
        Boards
      </TabPanel>
      <TabPanel value={value} index={1}>
        <div>
          <MembersHeader>
            <Typography variant="h6" fontWeight={400}>
              Team Members ({project.members.length})
            </Typography>
            <Button
              variant="outlined"
              onClick={handleClick}
              startIcon={<PersonAddAltIcon />}
            >
              Invite Team Members
            </Button>
            <InviteMembersModal
              handleClosePopover={handleClosePopover}
              anchorEl={anchorEl}
              project={project}
            />
          </MembersHeader>
          <ul style={{ paddingInlineStart: 0 }}>
            {project.members.map((member) => (
              <Member
                key={uuidv4()}
                user={member}
                authUser={{
                  ...authUser,
                  access_level: authUserAccessLevel,
                }}
                setProject={setProject}
              />
            ))}
          </ul>
        </div>
      </TabPanel>
      <TabPanel value={value} index={2}>
        Settings
      </TabPanel>
    </div>
  );
};

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3, width: "50%", marginLeft: "25%" }}>{children}</Box>
      )}
    </div>
  );
}

const EditForm = ({ project, setProject, setIsEditing }: EditFormProps) => {
  const { register, setValue, handleSubmit, errors, watch } =
    useForm<FormData>();
  const titleValue = watch("title", "");

  useEffect(() => {
    setValue("title", project.title);
    setValue("description", project.description);
  }, [project]);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      const { data: resData } = await authAxios.put(
        `${backendUrl}/projects/${project.id}/`,
        data
      );
      setProject(resData);
      setIsEditing(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{ marginLeft: "1.5em", width: "200px" }}
    >
      <TextareaAutosize
        placeholder="Title"
        required
        maxRows={3}
        {...register("title")}
        style={{
          width: "100%",
          padding: "0.5em",
          marginBottom: "0.7em",
        }}
      />

      <TextareaAutosize
        placeholder="Description"
        {...register("description")}
        minRows={3}
        style={{
          width: "100%",
          padding: "0.5em",
          marginBottom: "0.7em",
        }}
      />
      <div>
        <Button sx={{ marginRight: "0.5em" }} variant="outlined">
          Save
        </Button>
        <Button
          sx={{ marginRight: "0.5em" }}
          variant="outlined"
          onClick={() => setIsEditing(false)}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

const Member = ({ user, authUser, setProject }: MemberProps) => {
  const router = useRouter();

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const removeMember = async () => {
    try {
      await authAxios.delete(backendUrl + `/projects/members/${user.id}/`);
      if (authUser.username === user.username) {
        router.push("/");
        return;
      }
      setProject((project) => {
        const updatedMembers = project.members.filter(
          (member) => member.id !== user.id
        );
        project.members = updatedMembers;
        return { ...project };
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <li
      style={{ display: "flex", alignItems: "center", marginBottom: "1.25em" }}
    >
      <MemberListItem header="true" user={user} />
      <div style={{ marginLeft: "1em" }}>
        <Typography fontWeight={500} variant="body1">
          {user.full_name}
        </Typography>
        <Typography fontWeight={300} variant="caption" color="gray">
          @{user.username}
        </Typography>
      </div>
      <MemberButtonsContainer>
        {authUser.access_level === 2 ? (
          <Button variant="outlined" onClick={handleClick}>
            {user.access_level === 2 ? "Admin" : "Member"}
          </Button>
        ) : (
          <Typography>
            {user.access_level === 2 ? "Admin" : "Member"}
          </Typography>
        )}
        <ChangePermissionsModal
          handleClosePopover={handleClosePopover}
          anchorEl={anchorEl}
          member={user}
          setProject={setProject}
        />
        {(authUser.username === user.username ||
          authUser.access_level === 2) && (
          <Button
            startIcon={<CloseIcon />}
            variant="outlined"
            sx={{ marginLeft: 1 }}
            color="error"
            onClick={removeMember}
          >
            {authUser.username === user.username ? "Leave" : "Remove"}
          </Button>
        )}
      </MemberButtonsContainer>
    </li>
  );
};

export default Project;
