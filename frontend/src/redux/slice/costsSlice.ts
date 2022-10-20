import {
  createAsyncThunk,
  createSlice,
  isFulfilled,
  isPending,
  isRejectedWithValue,
  PayloadAction,
} from '@reduxjs/toolkit'
import { AxiosError } from 'axios'
import api from 'axios/axios'
import { CostsCategories } from 'common/enums/costsCategories.enum'
import { Currencies } from 'common/enums/currency.enum'
import { LoadingStatus } from 'common/enums/loading-status'
import { IWallet } from './walletsSlice'

const costsLimit = 5

export interface ICost {
  id: number
  createdAt: Date
  updatedAt: Date
  category_name: CostsCategories
  cost_name: string
  cost_sum: number
  is_transaction: boolean
}

export interface ICreateCostDto {
  cost_name: string
  cost_sum: number
}

export interface IUpdateCostDto {
  cost_name: string
  category_name: CostsCategories
  cost_sum: number
  createdAt: Date
}

export interface ICreateCost {
  walletId: number
  limit: number
  data: ICreateCostDto
}

interface IUpdateCost extends ICreateCost {
  transactionId: number
  data: IUpdateCostDto
}

interface IDeleteCost {
  transactionId: number
  walletId: number
  limit: number
}

export interface IGetWalletCosts extends IWallet {
  costs: ICost[]
  costs_count: number
}

interface IGetCostsParams {
  walletId: number
  limit: number
}

export interface IGetMoreCostsParams {
  walletId: number
  limit: number
  offset: number
}

interface ICostsState {
  costs: ICost[]
  loading: LoadingStatus
  errorMessage: string
  successMessage: string | null
  costs_count: number
  currency: Currencies
  limit: number
  offset: number
  currentCost: ICost | null
}

const initialState: ICostsState = {
  costs: [],
  loading: LoadingStatus.SUCCESS,
  errorMessage: '',
  successMessage: null,
  costs_count: 0,
  currency: Currencies.UAH,
  limit: costsLimit,
  offset: costsLimit,
  currentCost: null,
}

export const fetchCosts = createAsyncThunk<
  IGetWalletCosts,
  IGetCostsParams,
  { rejectValue: string }
>('costs/fetchCosts', async (params, { rejectWithValue }) => {
  try {
    const { data } = await api.get(
      `/costs/wallet/${params.walletId}?limit=${params.limit}`,
    )

    return data
  } catch (error) {
    if (error instanceof AxiosError) {
      return rejectWithValue(error.response?.data?.message)
    }
  }
})

export const fetchMoreCosts = createAsyncThunk<
  IGetWalletCosts,
  IGetMoreCostsParams,
  { rejectValue: string }
>('costs/fetchMoreCosts', async (params, { rejectWithValue }) => {
  try {
    const { data } = await api.get(
      `/costs/wallet/${params.walletId}?limit=${params.limit}&offset=${params.offset}`,
    )

    return data
  } catch (error) {
    if (error instanceof AxiosError) {
      return rejectWithValue(error.response?.data?.message)
    }
  }
})

export const addNewCost = createAsyncThunk<
  IGetWalletCosts,
  ICreateCost,
  { rejectValue: string }
>('costs/addCost', async (params, { rejectWithValue }) => {
  try {
    await api.post(`/costs/wallet/${params.walletId}`, params.data)

    const { data } = await api.get(
      `/costs/wallet/${params.walletId}?limit=${params.limit}`,
    )

    return data
  } catch (error) {
    if (error instanceof AxiosError) {
      return rejectWithValue(error.response?.data?.message)
    }
  }
})

export const updateCost = createAsyncThunk<
  IGetWalletCosts,
  IUpdateCost,
  { rejectValue: string }
>('costs/updateCost', async (params, { rejectWithValue }) => {
  try {
    await api.patch(`/costs/${params.transactionId}`, params.data)

    const { data } = await api.get(
      `/costs/wallet/${params.walletId}?limit=${params.limit}`,
    )

    return data
  } catch (error) {
    if (error instanceof AxiosError) {
      return rejectWithValue(error.response?.data?.message)
    }
  }
})

export const deleteCost = createAsyncThunk<
  IGetWalletCosts,
  IDeleteCost,
  { rejectValue: string }
>('costs/deleteCost', async (parans, { rejectWithValue }) => {
  try {
    await api.delete(`/costs/${parans.transactionId}`)

    const { data } = await api.get(`/costs/wallet/${parans.walletId}?limit=5`)

    return data
  } catch (error) {
    if (error instanceof AxiosError) {
      return rejectWithValue(error.response?.data?.message)
    }
  }
})

const isAllLoading = isPending(
  fetchCosts,
  fetchMoreCosts,
  addNewCost,
  updateCost,
  deleteCost,
)

const isAllSuccess = isFulfilled(
  fetchCosts,
  fetchMoreCosts,
  addNewCost,
  updateCost,
  deleteCost,
)

const isAllError = isRejectedWithValue(
  fetchCosts,
  fetchMoreCosts,
  addNewCost,
  updateCost,
  deleteCost,
)

const costSlice = createSlice({
  name: 'costs',
  initialState,
  reducers: {
    setOffset(state, action: PayloadAction<number>) {
      state.offset = action.payload
    },
    setCurrentCost(state, action: PayloadAction<ICost>) {
      state.currentCost = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCosts.fulfilled, (state, action) => {
        state.costs = action.payload.costs
        state.costs_count = action.payload.costs_count
        state.currency = action.payload.currency
        state.offset = costsLimit
      })
      .addCase(fetchMoreCosts.fulfilled, (state, action) => {
        state.costs = [...state.costs, ...action.payload.costs]
      })
      .addCase(addNewCost.fulfilled, (state, action) => {
        state.costs = action.payload.costs
        state.costs_count = action.payload.costs_count
        state.successMessage = 'Added new cost'
        state.offset = costsLimit
      })
      .addCase(updateCost.fulfilled, (state, action) => {
        state.costs = action.payload.costs
        state.costs_count = action.payload.costs_count
        state.successMessage = 'Update cost successfully'
        state.offset = costsLimit
      })
      .addCase(deleteCost.fulfilled, (state, action) => {
        state.costs = action.payload.costs
        state.costs_count = action.payload.costs_count
        state.successMessage = 'Delete cost successfully'
        state.offset = costsLimit
      })
      .addMatcher(isAllSuccess, (state) => {
        state.loading = LoadingStatus.SUCCESS
        state.errorMessage = ''
      })
      .addMatcher(isAllLoading, (state) => {
        state.loading = LoadingStatus.LOADING
        state.successMessage = null
        state.errorMessage = ''
      })
      .addMatcher(isAllError, (state, action: PayloadAction<string>) => {
        state.errorMessage = action.payload
        state.loading = LoadingStatus.ERROR
      })
  },
})

export const { setOffset, setCurrentCost } = costSlice.actions

export default costSlice.reducer