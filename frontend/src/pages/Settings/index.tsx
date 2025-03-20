import { Button, Paper, Loader, Image } from "@mantine/core";
import { useNavigate, useParams } from "react-router-dom";
import { deleteProject } from "@shared/api/project";
import DeleteIcon from "@assets/icons/delete.svg";
import { useState } from "react";

export const Settings = () => {
    const { projectId } = useParams();
    const [isDeleting, setIsDeleting] = useState(false);
    const navigate = useNavigate();

    return (
        <Paper p="md">
            {projectId && (
                <Button
                    variant="outline"
                    onClick={async () => {
                        setIsDeleting(true);
                        const { status } = await deleteProject(Number(projectId));
                        setIsDeleting(false);
                        if (status === 200) {
                            navigate("/");
                        }
                    }}
                    disabled={isDeleting}
                    leftSection={isDeleting ? <Loader size={20} /> : <Image src={DeleteIcon} />}
                >
                    Delete project
                </Button>
            )}
        </Paper>
    )
}