// Base DataSource Interface, Kontrak dasar untuk semua API datasources
import type { ApiResponse } from "../models/PesertaApiTypes";

// Interface untuk datasource dengan operasi list
export interface ListableDataSource<TItem, TParams = object> {
  getList(params?: TParams): Promise<ApiResponse<TItem>>;
}

// Interface untuk datasource dengan operasi detail
export interface DetailableDataSource<TDetail, TId = number> {
  getDetail(id: TId): Promise<ApiResponse<TDetail>>;
}

// Interface untuk datasource dengan operasi create
export interface CreatableDataSource<TDetail, TRequest> {
  create(data: TRequest): Promise<ApiResponse<TDetail>>;
}

// Interface untuk datasource dengan operasi update
export interface UpdatableDataSource<TDetail, TRequest, TId = number> {
  update(id: TId, data: Partial<TRequest>): Promise<ApiResponse<TDetail>>;
}

// Interface untuk datasource dengan operasi delete
export interface DeletableDataSource<TId = number> {
  delete(id: TId): Promise<ApiResponse<{ success: boolean; message: string }>>;
}

// Interface untuk datasource dengan operasi CRUD lengkap
export interface CrudDataSource<
  TListResponse,
  TDetail,
  TCreateRequest,
  TListParams = object,
  TId = number,
>
  extends
    ListableDataSource<TListResponse, TListParams>,
    DetailableDataSource<TDetail, TId>,
    CreatableDataSource<TDetail, TCreateRequest>,
    UpdatableDataSource<TDetail, TCreateRequest, TId>,
    DeletableDataSource<TId> {}

// Interface untuk datasource dengan operasi read-only
export interface ReadOnlyDataSource<
  TListResponse,
  TDetail,
  TListParams = object,
  TId = number,
>
  extends
    ListableDataSource<TListResponse, TListParams>,
    DetailableDataSource<TDetail, TId> {}
