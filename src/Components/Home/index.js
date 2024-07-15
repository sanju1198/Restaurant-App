import {useState, useEffect} from 'react'

import Header from '../Header'
import Disher from '../disher'

import './index.css'

const Home = () => {
  const [isloading, setisloading] = useState(true)
  const [response, setresponse] = useState([])
  const [cart, setCart] = useState([])
  const [activeCategoryId, setActiveCategoryId] = useState('')

  const addCart = dish => {
    const isAlreadyExists = cart.find(item => item.dishId === dish.dishId)

    if (!isAlreadyExists) {
      const newDish = {...dish, quantity: 1}
      setCart(prev => [...prev, newDish])
    } else {
      setCart(prev =>
        prev.map(item =>
          item.dishId === dish.dishId
            ? {...item, quantity: item.quantity + 1}
            : item,
        ),
      )
    }
  }

  const removeCart = dish => {
    const isAlreadyExists = cart.find(item => item.dishId === dish.dishId)

    if (isAlreadyExists) {
      setCart(prev =>
        prev
          .map(item =>
            item.dishId === dish.dishId
              ? {...item, quantity: item.quantity - 1}
              : item,
          )
          .filter(item => item.quantity > 0),
      )
    }
  }

  const necessaryData = tableMenuList =>
    tableMenuList.map(eachMenu => ({
      menuCategory: eachMenu.menu_category,
      menuCategoryId: eachMenu.menu_category_id,
      menuCategoryImage: eachMenu.menu_category_image,
      categoryDishes: eachMenu.category_dishes.map(eachDish => ({
        dishId: eachDish.dish_id,
        dishName: eachDish.dish_name,
        dishPrice: eachDish.dish_price,
        dishImage: eachDish.dish_image,
        dishCurrency: eachDish.dish_currency,
        dishCalories: eachDish.dish_calories,
        dishDescription: eachDish.dish_description,
        dishAvailability: eachDish.dish_Availability,
        dishType: eachDish.dish_Type,
        addonCat: eachDish.addonCat,
      })),
    }))

  const apirestaurantfetch = async () => {
    const api =
      'https://apis2.ccbp.in/restaurant-app/restaurant-menu-list-details'
    const apiresponse = await fetch(api)
    const data = await apiresponse.json()
    const updateddata = necessaryData(data[0].table_menu_list)
    setresponse(updateddata)
    setActiveCategoryId(updateddata[0].menuCategoryId)
    setisloading(false)
  }
  useEffect(() => {
    apirestaurantfetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onUpdateActiveCategory = menuCategoryId =>
    setActiveCategoryId(menuCategoryId)

  const renderTabMenuList = () =>
    response.map(eachCategory => {
      const onClickHandler = () =>
        onUpdateActiveCategory(eachCategory.menuCategoryId)

      return (
        <li
          className={`each-tab-item ${
            eachCategory.menuCategoryId === activeCategoryId
              ? 'active-tab-item'
              : ''
          }`}
          key={eachCategory.menuCategoryId}
          onClick={onClickHandler}
        >
          <button
            type="button"
            className="mt-0 mb-0 ms-2 me-2 tab-category-button"
          >
            {eachCategory.menuCategory}
          </button>
        </li>
      )
    })
  const renderDishes = () => {
    const {categoryDishes} = response.find(
      eachCategory => eachCategory.menuCategoryId === activeCategoryId,
    )

    return (
      <ul className="m-0 d-flex flex-column dishes-list-container">
        {categoryDishes.map(eachDish => (
          <Disher
            key={eachDish.dishId}
            dishDetails={eachDish}
            cartItems={cart}
            addItemToCart={addCart}
            removeItemFromCart={removeCart}
          />
        ))}
      </ul>
    )
  }

  const renderSpinner = () => (
    <div className="spinner-container">
      <div className="spinner-border" role="status" />
    </div>
  )

  return isloading ? (
    renderSpinner()
  ) : (
    <div className="home-background">
      <Header cartItems={cart} />
      <ul className="m-0 ps-0 d-flex tab-container">{renderTabMenuList()}</ul>
      {renderDishes()}
    </div>
  )
}

export default Home
