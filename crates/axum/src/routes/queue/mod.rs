// Copyright (C) 2023 Light, Inc.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

pub(crate) mod error;
pub(crate) mod portfolio;
pub(crate) mod token;
pub(crate) mod types;

use crate::state::AppState;
use autometrics::autometrics;
use axum::{routing::post, Router};

pub(crate) use portfolio::{__path_v1_queue_portfolio_handler, v1_queue_portfolio_handler};
pub(crate) use token::{__path_v1_queue_token_handler, v1_queue_token_handler};

// -----------------------------------------------------------------------------
// Router
// -----------------------------------------------------------------------------

#[autometrics]
pub(crate) fn router() -> Router<AppState> {
    Router::new()
        .route("/queue/portfolio", post(v1_queue_portfolio_handler))
        .route("/queue/token", post(v1_queue_token_handler))
}
