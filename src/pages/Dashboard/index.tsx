import { useEffect, useState } from 'react';

import Header from '../../components/Header';
import api from '../../services/api';
import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';

interface FoodModel {
  id?: number;
  name: string;
  image: string;
  price: number;
  available: boolean;
  description: string;
}

const Dashboard: React.FC = () => {
  const [foods, setFoods] = useState<FoodModel[]>([])
  const [editingFood, setEditingFood] = useState<FoodModel>({
    name: "",
    image: "",
    price: 0,
    available: false,
    description: "",
  })
  const [modalOpen, setModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)

  useEffect(() => {
    api.get<FoodModel[]>('/foods')
      .then(res => setFoods(res.data))
      .catch(err => console.error(err));

  }, []);

  const handleAddFood = async (food: FoodModel) => {
    if (!food.id)
      return;

    const response = await api.post('/foods', {
      ...food,
      available: true,
    });

    setFoods([...foods, response.data]);
  }

  const handleUpdateFood = async (food: FoodModel) => {
    if (!editingFood?.id)
      return;

    const foodUpdated = await api.put(
      `/foods/${editingFood.id}`,
      { ...editingFood, ...food },
    );

    const foodsUpdated = foods.map(f =>
      f.id !== foodUpdated.data.id ? f : foodUpdated.data,
    );

    setFoods(foodsUpdated);
  }

  const handleDeleteFood = async (id: number) => {
    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter(food => food.id !== id);

    setFoods(foodsFiltered);
  }

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  }

  const toggleEditModal = () => {
    setEditModalOpen(!editModalOpen);
  }

  const handleEditFood = (food: FoodModel) => {
    setEditingFood({ ...food });
    setEditModalOpen(true);
  }

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
          foods.map(food => (
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
