import { useEffect, useState } from "react";
import Food from "../../components/Food";
import Header from "../../components/Header";
import ModalAddFood, {
  ReceivedFormDataProps,
} from "../../components/ModalAddFood";
import ModalEditFood from "../../components/ModalEditFood";
import api from "../../services/api";
import { FoodsContainer } from "./styles";

type FoodProps = {
  available: boolean;
  description: string;
  id: number;
  image: string;
  name: string;
  price: string;
};

function Dashboard() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingFood, setEditingFood] = useState<FoodProps>({} as FoodProps);
  const [foods, setFoods] = useState<FoodProps[]>([]);

  useEffect(() => {
    const response = async () => {
      const getData = await api.get("/foods");
      setFoods(getData.data);
    };

    response();
  }, []);

  const handleAddFood = async (food: ReceivedFormDataProps) => {
    try {
      const response = await api.post("/foods", {
        ...food,
        available: true,
      });

      setFoods((foods) => [...foods, response.data]);
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpdateFood = async (food: ReceivedFormDataProps) => {
    try {
      const foodUpdated = await api.put(`/foods/${editingFood.id}`, {
        ...editingFood,
        ...food,
      });

      const foodsUpdated = foods.map((f) =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data
      );

      setFoods(foodsUpdated);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteFood = async (id: number) => {
    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter((food) => food.id !== id);

    setFoods(foodsFiltered);
  };

  const toggleModal = () => {
    setModalOpen((modalOpen) => !modalOpen);
  };

  const toggleEditModal = () => {
    setEditModalOpen((editModalOpen) => !editModalOpen);
  };

  const handleEditFood = (food: FoodProps) => {
    setEditingFood(food);
    setEditModalOpen(true);
  };

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map((food) => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
}

export default Dashboard;