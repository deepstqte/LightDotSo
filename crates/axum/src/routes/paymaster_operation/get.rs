// Copyright 2023-2024 Light, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

use super::types::PaymasterOperation;
use crate::{
    error::RouteError, result::AppJsonResult,
    routes::paymaster_operation::error::PaymasterOperationError, state::AppState,
};
use autometrics::autometrics;
use axum::{
    extract::{Query, State},
    Json,
};
use ethers_main::{types::H160, utils::to_checksum};
use lightdotso_prisma::{paymaster, paymaster_operation};
use lightdotso_tracing::tracing::info;
use prisma_client_rust::chrono::{NaiveDateTime, Utc};
use serde::Deserialize;
use utoipa::IntoParams;

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

#[derive(Debug, Deserialize, Default, IntoParams)]
#[serde(rename_all = "snake_case")]
#[into_params(parameter_in = Query)]
pub struct GetQuery {
    /// The address of the paymaster.
    pub address: String,
    /// The chain id of the paymaster.
    pub chain_id: i64,
    /// The timestamp of the paymaster.
    pub valid_after: i64,
}

// -----------------------------------------------------------------------------
// Handler
// -----------------------------------------------------------------------------

/// Get a paymaster
#[utoipa::path(
        get,
        path = "/paymaster_operation/get",
        params(
            GetQuery
        ),
        responses(
            (status = 200, description = "Paymaster Operation returned successfully", body = PaymasterOperation),
            (status = 404, description = "Paymaster Operation not found", body = PaymasterOperationError),
        )
    )]
#[autometrics]
pub(crate) async fn v1_paymaster_operation_get_handler(
    get_query: Query<GetQuery>,
    State(state): State<AppState>,
) -> AppJsonResult<PaymasterOperation> {
    // -------------------------------------------------------------------------
    // Parse
    // -------------------------------------------------------------------------

    // Get the get query.
    let Query(query) = get_query;
    let timestamp = NaiveDateTime::from_timestamp_opt(query.valid_after, 0);

    // If the timestamp is not valid, return a 500.
    let timestamp = timestamp.ok_or(RouteError::PaymasterOperationError(
        PaymasterOperationError::BadRequest("Invalid timestamp".to_string()),
    ))?;

    let valid_after = prisma_client_rust::chrono::DateTime::<Utc>::from_utc(timestamp, Utc);
    let parsed_query_address: H160 = query.address.parse()?;

    info!("Get paymaster for address: {:?}", query);

    // -------------------------------------------------------------------------
    // DB
    // -------------------------------------------------------------------------

    // First get the paymaster from the database.
    let paymaster = state
        .client
        .paymaster()
        .find_unique(paymaster::address_chain_id(
            to_checksum(&parsed_query_address, None),
            query.chain_id,
        ))
        .exec()
        .await?;

    // If the paymaster is not found, return a 404.
    let paymaster = paymaster.ok_or(RouteError::PaymasterOperationError(
        PaymasterOperationError::NotFound("Paymaster not found".to_string()),
    ))?;

    // Get the paymasters from the database.
    let paymaster_operation = state
        .client
        .paymaster_operation()
        .find_unique(paymaster_operation::valid_after_paymaster_id(
            valid_after.into(),
            paymaster.id,
        ))
        .with(paymaster_operation::billing_operation::fetch())
        .exec()
        .await?;

    // If the paymaster is not found, return a 404.
    let paymaster_operation = paymaster_operation.ok_or(RouteError::PaymasterOperationError(
        PaymasterOperationError::NotFound("Paymaster Operation not found".to_string()),
    ))?;

    // -------------------------------------------------------------------------
    // Return
    // -------------------------------------------------------------------------

    // Change the paymaster operation to the format that the API expects.
    let paymaster_operation: PaymasterOperation = paymaster_operation.into();

    Ok(Json::from(paymaster_operation))
}
