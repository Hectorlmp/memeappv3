import React, { useEffect, useState } from "react";
import {
  Card,
  Image,
  Text,
  Badge,
  Group,
  Container,
  Select,
  Button,
  SimpleGrid,
  Modal,
  Pagination,
} from "@mantine/core";
import { FcLike } from "react-icons/fc";
import LoginUser from "./LoginUser";

const VerMemes = () => {
  const [memes, setMemes] = useState([]);
  const [filteredMemes, setFilteredMemes] = useState([]);
  const [filter, setFilter] = useState("latest");
  const [opened, setOpened] = useState(false);
  const [selectedMeme, setSelectedMeme] = useState(null);
  const [page, setPage] = useState(1);
  const memesPerPage = 21;

  const fetchMemes = async () => {
    try {
      const response = await fetch(
        "https://memes-api.grye.org/memes/?sort_by=top&page=1&limit=100",
        { headers: { Accept: "application/json" } }
      );
      if (!response.ok) throw new Error("Error al obtener los memes");
      const data = await response.json();
      setMemes(data);
      setFilteredMemes(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleFilterChange = (value) => {
    setFilter(value);
    let sortedMemes = [...memes];
    if (value === "latest") {
      sortedMemes = sortedMemes.sort((a, b) => {
        const dateA = new Date(a.created_at);
        const dateB = new Date(b.created_at);
        return dateB - dateA;
      });
    } else if (value === "oldest") {
      sortedMemes = sortedMemes.sort((a, b) => {
        const dateA = new Date(a.created_at);
        const dateB = new Date(b.created_at);
        return dateA - dateB;
      });
    } else if (value === "most_likes") {
      sortedMemes = sortedMemes.sort((a, b) => b.likes - a.likes);
    } else if (value === "least_likes") {
      sortedMemes = sortedMemes.sort((a, b) => a.likes - b.likes);
    }
    setFilteredMemes(sortedMemes);
  };

  const handleLikeClick = (memeId) => {
    const updatedMemes = [...filteredMemes];
    const memeIndex = updatedMemes.findIndex((meme) => meme._id === memeId);
    if (memeIndex !== -1) {
      const meme = updatedMemes[memeIndex];
      if (localStorage.getItem(`liked_${memeId}`)) {
        alert("Ya le has dado like a este meme.");
        return;
      }
      updatedMemes[memeIndex].likes += 1;
      localStorage.setItem(`liked_${memeId}`, true);
      setFilteredMemes(updatedMemes);
    }
  };

  const handleCardClick = (meme) => {
    setSelectedMeme(meme);
    setOpened(true);
  };

  const displayedMemes = filteredMemes.slice(
    (page - 1) * memesPerPage,
    page * memesPerPage
  );

  useEffect(() => {
    fetchMemes();
    const interval = setInterval(() => {
      fetchMemes();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    handleFilterChange(filter);
  }, [memes]);

  return (
    <Container>
      <div style={{ position: "absolute", top: 20, left: 20, zIndex: 10 }}>
        <Select
          label="Filtrar por:"
          placeholder="Selecciona un filtro"
          value={filter}
          onChange={handleFilterChange}
          data={[
            { label: "Más recientes", value: "latest" },
            { label: "Más antiguos", value: "oldest" },
            { label: "Más likes", value: "most_likes" },
            { label: "Menos likes", value: "least_likes" },
          ]}
        />
      </div>
      <SimpleGrid cols={3} spacing="lg" breakpoints={[{ maxWidth: "sm", cols: 1 }]}>
        {displayedMemes.map((meme) => (
          <Card
            key={meme._id}
            shadow="sm"
            padding="lg"
            radius="md"
            withBorder
            mb="md"
            style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              height: "auto",
            }}
            onClick={() => handleCardClick(meme)}
          >
            <Card.Section>
              <Image
                src={meme.img_url}
                alt={meme.title}
                height={200}
                fit="contain"
                style={{
                  borderRadius: "8px",
                }}
              />
            </Card.Section>
            <Group position="apart" mt="md" mb="xs">
              <Text weight={500} style={{ fontSize: "18px", textAlign: "center" }}>
                {meme.title}
              </Text>
            </Group>
            <Text size="sm" color="dimmed" align="justify">
              {meme.description || "¡Un meme divertido para compartir!"}
            </Text>
            <Text size="xs" color="gray" mt="sm">
              Subido el: {new Date(meme.created_at).toLocaleDateString()}
            </Text>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                handleLikeClick(meme._id);
              }}
              style={{
                position: "absolute",
                bottom: 10,
                right: 10,
                backgroundColor: "#fff",
                color: "#4CAF50",
                width: 60,
                height: 60,
                borderRadius: "50%",
                padding: 0,
                boxShadow: "0 4px 6px rgba(0,0,0,0.2)",
                fontSize: "20px",
                border: "2px solidrgb(232, 13, 13)",
              }}
              variant="filled"
              size="xs"
            >
              <FcLike />
              <Text style={{ fontSize: "16px", fontWeight: "bold", marginLeft: "8px" }}>
                {meme.likes}
              </Text>
            </Button>
          </Card>
        ))}
      </SimpleGrid>
      <Pagination
        total={Math.ceil(filteredMemes.length / memesPerPage)}
        page={page}
        onChange={setPage}
        style={{ marginTop: "20px", textAlign: "center" }}
      />
      {selectedMeme && (
        <Modal
          opened={opened}
          onClose={() => setOpened(false)}
          title={selectedMeme.title}
          size="xl"
          overlayOpacity={0.5}
          overlayColor="gray"
        >
          <Image
            src={selectedMeme.img_url}
            alt={selectedMeme.title}
            width="100%"
            height={500}
            fit="contain"
          />
          <Text size="sm" color="dimmed" align="justify" mt="md">
            {selectedMeme.description || "¡Un meme divertido para compartir!"}
          </Text>
          <Text size="xs" color="gray" mt="sm">
            Subido el: {new Date(selectedMeme.created_at).toLocaleDateString()}
          </Text>
          <Badge color="green" variant="light" mt="md">
            {selectedMeme.likes} Likes
          </Badge>
        </Modal>
      )}
    </Container>
  );
};

export default VerMemes;
